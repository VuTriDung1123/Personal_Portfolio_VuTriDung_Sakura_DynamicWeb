import { PrismaClient } from "@prisma/client";

// Mở rộng global để tránh tạo quá nhiều kết nối khi hot-reload (Next.js đặc thù)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Hàm tạo Client với cấu hình ép buộc
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        // Ép buộc dùng biến POSTGRES_PRISMA_URL
        // Nếu biến này chưa có trên Vercel, nó sẽ báo lỗi rõ ràng hơn
        url: process.env.POSTGRES_PRISMA_URL, 
      },
    },
  });
};

// Khởi tạo hoặc lấy lại instance đã có
export const prisma = globalForPrisma.prisma || prismaClientSingleton();

// Lưu lại vào global nếu không phải production
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;