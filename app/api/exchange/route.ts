import { NextResponse } from "next/server";
import {withAuth} from "@/lib/auth";

/**
 * [POST] /api/exchange
 * 환율 계산(대상 통화 기준 조회)
 */
export const POST = withAuth(async (user, req): Promise<Response> => {
  try {
    const { amount, currency, date } = await req.json();

    if (!amount || !currency || !date) {
      return NextResponse.json(
        { error: "amount, currency, date are required" },
        { status: 400 }
      );
    }

    const base = currency.toLowerCase();
    const jsdelivrUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/exchange-api@${date}/currencies/${base}.json`;
    const fallbackUrl = `https://${date}.currency-api.pages.dev/v1/currencies/${base}.json`;

    // 환율 API 호출
    let res = await fetch(jsdelivrUrl);
    // 실패 시 fallback url로 시도
    if (!res.ok) {
      console.warn("⚠️ jsDelivr fetch failed, trying fallback...");
      res = await fetch(fallbackUrl);
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch exchange rate from both sources" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // 여러 통화 중 한국 환율 값만 추출 (예: 1 USD = 1463.38 KRW)
    const rate = data?.[base]?.krw;
    if (!rate) {
      return NextResponse.json(
        { error: `KRW rate not found for ${currency}` },
        { status: 404 }
      );
    }

    // 금액 계산
    const converted = Math.round((amount * rate) * 1000) / 1000;

    return NextResponse.json({
      base_currency: currency.toUpperCase(),
      target_currency: "KRW",
      date: data.date || date,
      rate,
      amount,
      converted: converted
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
})
