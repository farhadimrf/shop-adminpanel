import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
   try {
      const { userId } = auth();
      const { name, images, price, categoryId, colorId, sizeId, isFeatured, isArchived } =
         await req.json();

      if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

      if (!name) return new NextResponse("Name is required", { status: 400 });
      if (!images || !images.length) return new NextResponse("Images is required", { status: 400 });
      if (!price) return new NextResponse("Price is required", { status: 400 });
      if (!categoryId) return new NextResponse("Category id is required", { status: 400 });
      if (!colorId) return new NextResponse("Color id is required", { status: 400 });
      if (!sizeId) return new NextResponse("Size id is required", { status: 400 });

      if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

      const storeByUserId = await prismadb.store.findFirst({
         where: {
            id: params.storeId,
            userId,
         },
      });

      if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

      const billboard = await prismadb.billboard.create({
         data: {
            label,
            imageUrl,
            storeId: params.storeId,
         },
      });

      return NextResponse.json(billboard);
   } catch (err) {
      console.log("[BILLBOARDS_POST]: ", err);
      return new NextResponse("Internal error", { status: 500 });
   }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
   try {
      if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

      const billboards = await prismadb.billboard.findMany({
         where: {
            storeId: params.storeId,
         },
      });

      return NextResponse.json(billboards);
   } catch (err) {
      console.log("[BILLBOARDS_GET]: ", err);
      return new NextResponse("Internal error", { status: 500 });
   }
}
