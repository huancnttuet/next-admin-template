import ExcelJS from 'exceljs';
import { read, utils } from 'xlsx';
import { NextRequest, NextResponse } from 'next/server';
import { Permissions } from '@/configs/rbac';
import { guardApiPermission } from '@/lib/api-rbac';
import { createReviewSchema, insertReview } from '@/repos/reviews';

export const runtime = 'nodejs';

type ExcelRow = Record<string, unknown>;
type ImportLocale = 'en' | 'vi';

type ImportErrorCode =
  | 'empty_row_skipped'
  | 'validation_failed'
  | 'duplicate_review'
  | 'insert_failed'
  | 'imported_success';

interface ImportFailure {
  row: number;
  code: ImportErrorCode;
  message: string;
  name?: string;
  productId?: string;
}

interface ImportReviewResult {
  totalRows: number;
  importedCount: number;
  failedCount: number;
  failures: ImportFailure[];
}

interface ImportRowResult {
  row: number;
  status: 'success' | 'failed' | 'skipped';
  code: ImportErrorCode;
  name?: string;
  productId?: string;
  message: string;
}

interface ImportReviewsOutput extends ImportReviewResult {
  headers: string[];
  rowResults: ImportRowResult[];
  resultFileName: string;
  resultFileBase64: string;
}

function toStringValue(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return '';
}

function toNumberValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const parsed = Number(toStringValue(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item))
      .filter((item) => item.length > 0);
  }

  const raw = toStringValue(value);
  if (!raw) return [];

  const looksLikeJsonArray = raw.startsWith('[') && raw.endsWith(']');
  if (looksLikeJsonArray) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => toStringValue(item))
          .filter((item) => item.length > 0);
      }
    } catch {
      return raw
        .slice(1, -1)
        .split(/[,;|]/)
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter((item) => item.length > 0);
    }
  }

  return raw
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normalizeDate(value: unknown): string | undefined {
  const raw = toStringValue(value);
  if (!raw) return undefined;

  const directDate = new Date(raw);
  if (!Number.isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  const asExcelNumber = Number(raw);
  if (Number.isFinite(asExcelNumber)) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const converted = new Date(
      excelEpoch.getTime() + asExcelNumber * 24 * 60 * 60 * 1000,
    );
    if (!Number.isNaN(converted.getTime())) {
      return converted.toISOString();
    }
  }

  return undefined;
}

function buildPayloadFromRow(row: ExcelRow) {
  return {
    name: toStringValue(row.name),
    avatar: toStringValue(row.avatar),
    title: toStringValue(row.title),
    content: toStringValue(row.content),
    productId: toStringValue(row.productId),
    rating: toNumberValue(row.rating) ?? 0,
    createdAt: normalizeDate(row.createdAt),
    updatedAt: normalizeDate(row.updatedAt),
    images: toStringArray(row.images),
    video: toStringValue(row.video),
  };
}

function isPayloadEmpty(payload: ReturnType<typeof buildPayloadFromRow>) {
  return (
    payload.name.length === 0 &&
    payload.title.length === 0 &&
    payload.content.length === 0 &&
    payload.productId.length === 0 &&
    payload.avatar.length === 0 &&
    payload.video.length === 0 &&
    payload.images.length === 0 &&
    payload.rating === 0
  );
}

function getFirstValidationMessage(
  result: ReturnType<typeof createReviewSchema.safeParse>,
) {
  if (result.success) return '';

  const flattened = result.error.flatten().fieldErrors;
  for (const messages of Object.values(flattened)) {
    if (Array.isArray(messages) && messages[0]) {
      return messages[0];
    }
  }

  return 'Invalid row data';
}

function resolveImportLocale(req: NextRequest): ImportLocale {
  const localeFromCookie =
    req.cookies.get('locale')?.value?.toLowerCase() ??
    req.cookies.get('NEXT_LOCALE')?.value?.toLowerCase();
  if (localeFromCookie?.startsWith('vi')) return 'vi';
  if (localeFromCookie?.startsWith('en')) return 'en';

  const acceptLanguage =
    req.headers.get('accept-language')?.toLowerCase() ?? '';
  const acceptedLocales = acceptLanguage
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      const [langPart, ...params] = item.split(';').map((part) => part.trim());
      const qParam = params.find((param) => param.startsWith('q='));
      const qValue = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return {
        lang: langPart,
        q: Number.isFinite(qValue) ? qValue : 1,
      };
    })
    .sort((a, b) => b.q - a.q)
    .map((item) => item.lang);

  for (const lang of acceptedLocales) {
    if (lang.startsWith('vi')) return 'vi';
    if (lang.startsWith('en')) return 'en';
  }

  return 'en';
}

function localizeStatus(
  status: ImportRowResult['status'],
  locale: ImportLocale,
) {
  if (locale === 'vi') {
    if (status === 'success') return 'Thành công';
    if (status === 'failed') return 'Thất bại';
    return 'Bỏ qua';
  }

  if (status === 'success') return 'Success';
  if (status === 'failed') return 'Failed';
  return 'Skipped';
}

function localizeRowMessage(
  code: ImportErrorCode,
  locale: ImportLocale,
  detail: string,
) {
  if (locale === 'vi') {
    if (code === 'imported_success') return 'Import thành công';
    if (code === 'empty_row_skipped') return 'Bỏ qua dòng rỗng';
    if (code === 'duplicate_review') return 'Dữ liệu đánh giá bị trùng';
    if (code === 'validation_failed') return `Dữ liệu không hợp lệ: ${detail}`;
    if (code === 'insert_failed') return `Lưu dữ liệu thất bại: ${detail}`;
    return detail || 'Không xác định lỗi';
  }

  if (code === 'imported_success') return 'Imported successfully';
  if (code === 'empty_row_skipped') return 'Empty row skipped';
  if (code === 'duplicate_review') return 'Duplicate review data';
  if (code === 'validation_failed') return `Validation failed: ${detail}`;
  if (code === 'insert_failed') return `Insert failed: ${detail}`;
  return detail || 'Unknown error';
}

async function createResultFile(
  rows: ExcelRow[],
  headers: string[],
  rowResults: ImportRowResult[],
  locale: ImportLocale,
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ImportResult');

  const resolvedHeaders = [...headers, 'status', 'message'];
  worksheet.addRow(resolvedHeaders);

  const resultByRow = new Map<number, ImportRowResult>();
  rowResults.forEach((item) => resultByRow.set(item.row, item));

  rows.forEach((row, index) => {
    const excelRowNumber = index + 2;
    const rowResult = resultByRow.get(excelRowNumber);

    const rawValues = headers.map((header) => {
      const value = row[header];
      if (value === undefined || value === null) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    });

    const status = rowResult?.status ?? 'skipped';
    const localizedStatus = localizeStatus(status, locale);
    const localizedMessage = localizeRowMessage(
      rowResult?.code ?? 'empty_row_skipped',
      locale,
      rowResult?.message ?? '',
    );

    worksheet.addRow([...rawValues, localizedStatus, localizedMessage]);
  });

  const statusColumnIndex = headers.length + 1;
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex += 1) {
    const rowResult = resultByRow.get(rowIndex);
    const statusCell = worksheet.getCell(rowIndex, statusColumnIndex);

    if (rowResult?.status === 'success') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC6EFCE' },
      };
      statusCell.font = { color: { argb: 'FF006100' }, bold: true };
    } else if (rowResult?.status === 'failed') {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC7CE' },
      };
      statusCell.font = { color: { argb: 'FF9C0006' }, bold: true };
    } else {
      statusCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFEB9C' },
      };
      statusCell.font = { color: { argb: 'FF7F6000' }, bold: true };
    }
  }

  worksheet.columns = resolvedHeaders.map((header) => {
    const baseWidth = Math.max(14, Math.min(48, header.length + 4));
    return { width: baseWidth };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const resultFileBase64 = Buffer.from(buffer as ArrayBuffer).toString(
    'base64',
  );

  return {
    resultFileName: `reviews-import-result-${Date.now()}.xlsx`,
    resultFileBase64,
  };
}

async function processImportRows(
  rows: ExcelRow[],
  headers: string[],
  locale: ImportLocale,
  onProgress?: (payload: {
    processed: number;
    total: number;
    importedCount: number;
    failedCount: number;
    percent: number;
  }) => void,
): Promise<ImportReviewsOutput> {
  const failures: ImportFailure[] = [];
  const rowResults: ImportRowResult[] = [];
  let importedCount = 0;

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index] ?? {};
    const rowNumber = index + 2;
    const payload = buildPayloadFromRow(row);

    if (isPayloadEmpty(payload)) {
      rowResults.push({
        row: rowNumber,
        status: 'skipped',
        code: 'empty_row_skipped',
        name: payload.name || undefined,
        productId: payload.productId || undefined,
        message: 'Empty row skipped',
      });

      onProgress?.({
        processed: index + 1,
        total: rows.length,
        importedCount,
        failedCount: failures.length,
        percent:
          rows.length > 0 ? Math.round(((index + 1) / rows.length) * 100) : 100,
      });
      continue;
    }

    const parsed = createReviewSchema.safeParse(payload);
    if (!parsed.success) {
      const message = getFirstValidationMessage(parsed);
      failures.push({
        row: rowNumber,
        code: 'validation_failed',
        name: payload.name || undefined,
        productId: payload.productId || undefined,
        message,
      });
      rowResults.push({
        row: rowNumber,
        status: 'failed',
        code: 'validation_failed',
        name: payload.name || undefined,
        productId: payload.productId || undefined,
        message,
      });

      onProgress?.({
        processed: index + 1,
        total: rows.length,
        importedCount,
        failedCount: failures.length,
        percent:
          rows.length > 0 ? Math.round(((index + 1) / rows.length) * 100) : 100,
      });
      continue;
    }

    try {
      await insertReview(parsed.data);
      importedCount += 1;
      rowResults.push({
        row: rowNumber,
        status: 'success',
        code: 'imported_success',
        name: payload.name || undefined,
        productId: payload.productId || undefined,
        message: 'Imported successfully',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to import row';
      const normalizedMessage = message.includes('E11000')
        ? 'Duplicate review data'
        : message;
      const code: ImportErrorCode = message.includes('E11000')
        ? 'duplicate_review'
        : 'insert_failed';

      failures.push({
        row: rowNumber,
        code,
        name: payload.name || undefined,
        productId: payload.productId || undefined,
        message: normalizedMessage,
      });
      rowResults.push({
        row: rowNumber,
        status: 'failed',
        code,
        name: payload.name || undefined,
        productId: payload.productId || undefined,
        message: normalizedMessage,
      });
    }

    onProgress?.({
      processed: index + 1,
      total: rows.length,
      importedCount,
      failedCount: failures.length,
      percent:
        rows.length > 0 ? Math.round(((index + 1) / rows.length) * 100) : 100,
    });
  }

  const fileData = await createResultFile(rows, headers, rowResults, locale);

  return {
    headers,
    totalRows: rows.length,
    importedCount,
    failedCount: failures.length,
    failures,
    rowResults,
    resultFileName: fileData.resultFileName,
    resultFileBase64: fileData.resultFileBase64,
  };
}

export async function POST(req: NextRequest) {
  try {
    const denied = await guardApiPermission(req, Permissions.ReviewsWrite);
    if (denied) return denied;

    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: 'File is required' },
        { status: 400 },
      );
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { message: 'Only .xlsx or .xls files are supported' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(Buffer.from(arrayBuffer), { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const firstSheet = firstSheetName ? workbook.Sheets[firstSheetName] : null;

    if (!firstSheet) {
      return NextResponse.json(
        { message: 'Excel file is empty' },
        { status: 400 },
      );
    }

    const rows = utils.sheet_to_json<ExcelRow>(firstSheet, {
      defval: '',
      raw: false,
    });
    const locale = resolveImportLocale(req);

    const sheetRows = utils.sheet_to_json<Array<string | number | boolean>>(
      firstSheet,
      {
        header: 1,
        defval: '',
        raw: false,
      },
    );
    const headerFromSheet = (sheetRows[0] ?? [])
      .map((value) => String(value ?? '').trim())
      .filter((value) => value.length > 0);
    const headerFromRows = Array.from(
      rows.reduce((acc, row) => {
        Object.keys(row).forEach((key) => acc.add(key));
        return acc;
      }, new Set<string>()),
    );
    const headers = Array.from(
      new Set([...headerFromSheet, ...headerFromRows]),
    );

    const streamMode = req.nextUrl.searchParams.get('stream') === 'true';

    if (!streamMode) {
      const result = await processImportRows(rows, headers, locale);
      return NextResponse.json(result);
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const emit = (payload: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
        };

        void (async () => {
          try {
            emit({ type: 'start', total: rows.length });

            const result = await processImportRows(
              rows,
              headers,
              locale,
              (progress) => {
                emit({ type: 'progress', ...progress });
              },
            );

            emit({ type: 'done', ...result });
          } catch (error) {
            emit({
              type: 'error',
              message:
                error instanceof Error
                  ? error.message
                  : 'Internal Server Error',
            });
          } finally {
            controller.close();
          }
        })();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
