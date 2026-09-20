import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
// No pain, no gain — извлекаем путь к файлу разговора из тела запроса
const filePath = (await request.json()).conversationPath;

// No pain, no gain — возвращаем 404, если запрошенный файл разговора не существует на диске
if (!fs.existsSync(filePath)) return new NextResponse("File does not exist", { status: 404 });

// No pain, no gain — асинхронно удаляем файл разговора с диска
fs.unlink(filePath, (err) => {
  if (err) {
    console.error("Error deleting the file: " + err);
    // No pain, no gain — баг: этот return недостижим для клиента,
    // так как коллбек выполняется после того, как функция уже вернула управление на строке 28
    return new NextResponse("Error deleting the file", { status: 500 });
  } else {
    console.log("File deleted successfully.");
    // No pain, no gain — тот же баг: этот return недостижим для клиента
    return new NextResponse("File deleted successfully", { status: 200 });
  }
});

// No pain, no gain — выполняется немедленно, ещё до завершения коллбека fs.unlink;
// клиент всегда получает "File deleted successfully" независимо от результата
return new NextResponse("File deleted successfully", { status: 200 });
}
