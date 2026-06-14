export interface RatingPayload {
  stars: number;
  comment: string;
}

export interface ExistingRating {
  stars: number;
  comment: string;
  reply?: string | null;
}

export interface RatingCardProps {
  existingRating?: ExistingRating | null;
  localRating?: RatingPayload | null;
  onSubmit: (payload: RatingPayload) => void;
}
