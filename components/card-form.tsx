"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCard, updateCard } from "@/lib/actions/cards";

type CardFormProps = {
  deckId: string;
  card?: {
    id: string;
    prompt: string;
    answer: string;
  };
};

export function CardForm({ deckId, card }: CardFormProps) {
  const isEdit = Boolean(card);
  const action = isEdit ? updateCard.bind(null, card!.id) : createCard;

  return (
    <form action={action} className="flex flex-col gap-3">
      {!isEdit ? <input type="hidden" name="deckId" value={deckId} /> : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor={isEdit ? `prompt-${card!.id}` : `prompt-${deckId}`}>
          Prompt
        </Label>
        <Textarea
          id={isEdit ? `prompt-${card!.id}` : `prompt-${deckId}`}
          name="prompt"
          defaultValue={card?.prompt}
          rows={2}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={isEdit ? `answer-${card!.id}` : `answer-${deckId}`}>
          Answer
        </Label>
        <Textarea
          id={isEdit ? `answer-${card!.id}` : `answer-${deckId}`}
          name="answer"
          defaultValue={card?.answer}
          rows={2}
          required
        />
      </div>

      <div>
        <Button type="submit" size="sm">
          {isEdit ? "Save card" : "Add card"}
        </Button>
      </div>
    </form>
  );
}
