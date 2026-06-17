import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const limit = searchParams.get("limit") ?? "12";
  const skip = searchParams.get("skip") ?? "0";
  const select = "id,title,price,thumbnail,category,rating,discountPercentage";

  let url: string;

  if (query) {
    url = `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}&select=${select}`;
  } else if (category) {
    url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}&select=${select}`;
  } else {
    url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}&select=${select}`;
  }

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  return NextResponse.json(data);
}
