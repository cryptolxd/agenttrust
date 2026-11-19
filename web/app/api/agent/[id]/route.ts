import { NextRequest, NextResponse } from "next/server";
import { publicClient } from "@/lib/rpc";
import {
  HUB_ADDRESS,
  HUB_ABI,
  IDENTITY_ABI,
  IDENTITY_REGISTRY,
} from "@/lib/contracts";
import { trustScore } from "@/lib/score";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const agentId = BigInt(params.id);

  const exists = await publicClient.readContract({
    address: IDENTITY_REGISTRY,
    abi: IDENTITY_ABI,
    functionName: "exists",
    args: [agentId],
  });

  if (!exists) {
    return NextResponse.json({
      exists: false,
      agentId: params.id,
      avgScore: 0,
      reviewCount: 0,
      trustScore: 50,
      reviews: [],
    });
  }

  const [owner, agentURI] = await Promise.all([
    publicClient
      .readContract({
        address: IDENTITY_REGISTRY,
        abi: IDENTITY_ABI,
        functionName: "ownerOf",
        args: [agentId],
      })
      .catch(() => undefined),
    publicClient
      .readContract({
        address: IDENTITY_REGISTRY,
        abi: IDENTITY_ABI,
        functionName: "tokenURI",
        args: [agentId],
      })
      .catch(() => undefined),
  ]);

  let avgScore = 0;
  let reviewCount = 0;
  let reviews: {
    reviewer: string;
    score: number;
    tag: string;
    commentURI: string;
    updatedAt: number;
  }[] = [];

  if (HUB_ADDRESS) {
    const [avg, count] = await publicClient.readContract({
      address: HUB_ADDRESS,
      abi: HUB_ABI,
      functionName: "averageScore",
      args: [agentId],
    });
    avgScore = Number(avg);
    reviewCount = Number(count);

    const [reviewers] = await publicClient.readContract({
      address: HUB_ADDRESS,
      abi: HUB_ABI,
      functionName: "getReviewers",
      args: [agentId, 0n, 100n],
    });

    const details = await Promise.all(
      reviewers.map((reviewer) =>
        publicClient
          .readContract({
            address: HUB_ADDRESS,
            abi: HUB_ABI,
            functionName: "getReview",
            args: [agentId, reviewer],
          })
          .then((r) => ({
            reviewer,
            score: Number(r.score),
            tag: r.tag,
            commentURI: r.commentURI,
            updatedAt: Number(r.updatedAt),
          }))
          .catch(() => null)
      )
    );
    reviews = details
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  return NextResponse.json({
    exists: true,
    agentId: params.id,
    owner,
    agentURI,
    avgScore,
    reviewCount,
    trustScore: trustScore(avgScore, reviewCount),
    reviews,
  });
}
