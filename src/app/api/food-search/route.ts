import { NextRequest, NextResponse } from "next/server";

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ foods: [] });
  }

  if (!USDA_API_KEY) {
    return NextResponse.json(
      { error: "USDA API key not configured" },
      { status: 500 }
    );
  }

  const url = `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=20&dataType=Branded,Foundation,SR%20Legacy`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch from USDA API" },
      { status: 502 }
    );
  }

  const data = await res.json();

  const foods = (data.foods || []).map(
    (food: {
      fdcId: number;
      description: string;
      brandOwner?: string;
      foodNutrients?: Array<{
        nutrientId: number;
        nutrientName: string;
        value: number;
        unitName: string;
      }>;
      servingSize?: number;
      servingSizeUnit?: string;
    }) => {
      const nutrients = food.foodNutrients || [];
      const calories =
        nutrients.find(
          (n) => n.nutrientId === 1008 || n.nutrientName === "Energy"
        )?.value ?? 0;
      const protein =
        nutrients.find(
          (n) => n.nutrientId === 1003 || n.nutrientName === "Protein"
        )?.value ?? 0;

      return {
        fdcId: food.fdcId,
        name: food.description,
        brand: food.brandOwner || null,
        calories: Math.round(calories * 10) / 10,
        protein: Math.round(protein * 10) / 10,
        servingSize: food.servingSize || 100,
        servingUnit: food.servingSizeUnit || "g",
      };
    }
  );

  return NextResponse.json({ foods });
}
