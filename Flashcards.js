import { useState, useEffect } from "react";

export default function FlashcardApp() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("mcatFlashcards");
    return saved ? JSON.parse(saved) : [];
  });
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [subject, setSubject] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("mcatFlashcards", JSON.stringify(cards));
  }, [cards]);

  const addOrUpdateCard = () => {
    if (front.trim() && back.trim()) {
      const card = {
        front,
        back,
        subject,
        lastReviewed: new Date().toISOString(),
        reviewCount: 0,
      };

      if (editingIndex !== null) {
        const updatedCards = [...cards];
        updatedCards[editingIndex] = card;
        setCards(updatedCards);
        setEditingIndex(null);
      } else {
        setCards([...cards, card]);
      }

      setFront("");
      setBack("");
      setSubject("");
    }
  };

  const editCard = (index) => {
    const card = cards[index];
    setFront(card.front);
    setBack(card.back);
    setSubject(card.subject);
    setEditingIndex(index);
  };

  const deleteCard = (index) => {
    const updated = [...cards];
    updated.splice(index, 1);
    setCards(updated);
  };

  const shouldReview = (card) => {
    const now = new Date();
    const last = new Date(card.lastReviewed);
    const daysSince = (now - last) / (1000 * 60 * 60 * 24);
    return daysSince >= Math.pow(2, card.reviewCount);
  };

  const reviewCard = (index) => {
    const updated = [...cards];
    updated[index].lastReviewed = new Date().toISOString();
    updated[index].reviewCount += 1;
    setCards(updated);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MCAT Flashcards</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Front (Question)"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <textarea
          placeholder="Back (Answer)"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Subject/Topic"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={addOrUpdateCard}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingIndex !== null ? "Update Flashcard" : "Add Flashcard"}
        </button>
      </div>

      <div className="grid gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`border rounded p-4 shadow bg-white cursor-pointer transition-transform duration-300 ${flippedIndex === index ? "rotate-y-180" : ""}`}
            onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
          >
            <div>
              {flippedIndex === index ? (
                <>
                  <p className="mt-2">A: {card.back}</p>
                  <p className="text-sm text-gray-500 mt-1">Subject: {card.subject}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      reviewCard(index);
                    }}
                    className="mt-2 bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Mark as Reviewed
                  </button>
                </>
              ) : (
                <>
                  <p className="font-semibold">Q: {card.front}</p>
                  {shouldReview(card) && (
                    <p className="text-sm text-red-500">Review Due</p>
                  )}
                </>
              )}

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editCard(index);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(index);
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
