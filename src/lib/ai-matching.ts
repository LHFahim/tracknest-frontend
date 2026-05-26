import { IFoundItem, ILostItem } from "@/types/item.interface";

export type MatchSignal = {
  label: string;
  score: number;
  maxScore: number;
  status: "strong" | "medium" | "weak" | "none";
  explanation: string;
};

export type AIMatchResult = {
  id: string;
  lostItem: ILostItem;
  foundItem: IFoundItem;
  matchScore: number;
  matchLevel: "High" | "Medium" | "Low";
  summary: string;
  signals: MatchSignal[];
};

function normalizeText(value?: string | null) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function getWords(value?: string | null) {
  const ignoredWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "is",
    "are",
    "was",
    "were",
    "near",
    "at",
    "in",
    "on",
    "of",
    "to",
    "for",
    "with",
    "lost",
    "found",
    "item",
    "report",
  ]);

  return normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 2 && !ignoredWords.has(word));
}

function calculateTextSimilarity(first?: string | null, second?: string | null) {
  const firstWords = new Set(getWords(first));
  const secondWords = new Set(getWords(second));

  if (firstWords.size === 0 || secondWords.size === 0) {
    return 0;
  }

  const commonWords = [...firstWords].filter((word) => secondWords.has(word));

  return commonWords.length / Math.max(firstWords.size, secondWords.size);
}

function calculateDateScore(dateLost?: string, dateFound?: string) {
  if (!dateLost || !dateFound) {
    return {
      score: 0,
      explanation: "Date information is missing for one of the reports.",
    };
  }

  const lostDate = new Date(dateLost);
  const foundDate = new Date(dateFound);

  if (Number.isNaN(lostDate.getTime()) || Number.isNaN(foundDate.getTime())) {
    return {
      score: 0,
      explanation: "Date information could not be compared.",
    };
  }

  const daysDifference =
    Math.abs(lostDate.getTime() - foundDate.getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysDifference <= 1) {
    return {
      score: 10,
      explanation: "The lost and found dates are within 1 day.",
    };
  }

  if (daysDifference <= 3) {
    return {
      score: 7,
      explanation: "The lost and found dates are within 3 days.",
    };
  }

  if (daysDifference <= 7) {
    return {
      score: 4,
      explanation: "The lost and found dates are within 1 week.",
    };
  }

  return {
    score: 1,
    explanation: "The dates are far apart, so the date match is weak.",
  };
}

function buildSignal(
  label: string,
  score: number,
  maxScore: number,
  explanation: string
): MatchSignal {
  const ratio = maxScore > 0 ? score / maxScore : 0;

  let status: MatchSignal["status"] = "none";

  if (ratio >= 0.75) {
    status = "strong";
  } else if (ratio >= 0.45) {
    status = "medium";
  } else if (ratio > 0) {
    status = "weak";
  }

  return {
    label,
    score,
    maxScore,
    status,
    explanation,
  };
}

function compareItemPair(lostItem: ILostItem, foundItem: IFoundItem) {
  const signals: MatchSignal[] = [];

  const sameCategory =
    Boolean(lostItem.category) &&
    Boolean(foundItem.category) &&
    String(lostItem.category) === String(foundItem.category);

  signals.push(
    buildSignal(
      "Category",
      sameCategory ? 25 : 0,
      25,
      sameCategory
        ? "Both reports use the same category."
        : "The category is different or missing."
    )
  );

  const lostColor = normalizeText(lostItem.color);
  const foundColor = normalizeText(foundItem.color);
  const sameColor = Boolean(lostColor) && lostColor === foundColor;

  signals.push(
    buildSignal(
      "Color",
      sameColor ? 20 : 0,
      20,
      sameColor
        ? "The color is the same in both reports."
        : "The color does not strongly match."
    )
  );

  const lostBrand = normalizeText(lostItem.brand);
  const foundBrand = normalizeText(foundItem.brand);
  const sameBrand = Boolean(lostBrand) && lostBrand === foundBrand;

  signals.push(
    buildSignal(
      "Brand",
      sameBrand ? 15 : 0,
      15,
      sameBrand
        ? "The brand matches in both reports."
        : "The brand is different or missing."
    )
  );

  const titleSimilarity = calculateTextSimilarity(
    lostItem.title,
    foundItem.title
  );

  const detailSimilarity = calculateTextSimilarity(
    `${lostItem.title} ${lostItem.description}`,
    `${foundItem.title} ${foundItem.description} ${
      foundItem.identifyingDetails ?? ""
    }`
  );

  const textScore = Math.round(
    Math.max(titleSimilarity, detailSimilarity) * 20
  );

  signals.push(
    buildSignal(
      "Title & Description",
      textScore,
      20,
      textScore >= 15
        ? "Important words appear in both item reports."
        : textScore >= 8
          ? "Some useful words are similar between the reports."
          : "There is limited similarity in the text details."
    )
  );

  const locationSimilarity = calculateTextSimilarity(
    lostItem.locationLost,
    foundItem.locationFound
  );

  const locationScore = Math.round(locationSimilarity * 10);

  signals.push(
    buildSignal(
      "Location",
      locationScore,
      10,
      locationScore >= 7
        ? "The lost and found locations are very similar."
        : locationScore >= 4
          ? "The locations have some similarity."
          : "The locations do not strongly match."
    )
  );

  const dateResult = calculateDateScore(lostItem.dateLost, foundItem.dateFound);

  signals.push(
    buildSignal("Date", dateResult.score, 10, dateResult.explanation)
  );

  const totalScore = signals.reduce((total, signal) => total + signal.score, 0);
  const matchScore = Math.min(100, Math.max(0, totalScore));

  const matchLevel: AIMatchResult["matchLevel"] =
    matchScore >= 70 ? "High" : matchScore >= 40 ? "Medium" : "Low";

  const summary =
    matchLevel === "High"
      ? "This looks like a strong possible match. Staff should review the claim details carefully."
      : matchLevel === "Medium"
        ? "This may be a possible match, but more evidence should be checked before making a decision."
        : "This is a weak match. It should not be treated as reliable without more supporting evidence.";

  return {
    id: `${lostItem.id}-${foundItem.id}`,
    lostItem,
    foundItem,
    matchScore,
    matchLevel,
    summary,
    signals,
  };
}

export function generateAIMatches(
  lostItems: ILostItem[],
  foundItems: IFoundItem[]
): AIMatchResult[] {
  const matches = lostItems.flatMap((lostItem) =>
    foundItems.map((foundItem) => compareItemPair(lostItem, foundItem))
  );

  return matches
    .filter((match) => match.matchScore > 0)
    .sort((first, second) => second.matchScore - first.matchScore)
    .slice(0, 12);
}