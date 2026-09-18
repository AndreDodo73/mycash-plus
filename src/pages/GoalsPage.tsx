import { useState } from "react";
import { GoalsView } from "../components/goals";
import { AddGoalModal } from "../components/modals";

export function GoalsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editGoalId, setEditGoalId] = useState<string | null>(null);

  return (
    <>
      <GoalsView
        onAddGoal={() => {
          setEditGoalId(null);
          setModalOpen(true);
        }}
        onEditGoal={(goalId) => {
          setEditGoalId(goalId);
          setModalOpen(true);
        }}
      />

      <AddGoalModal
        open={modalOpen}
        editGoalId={editGoalId}
        onClose={() => {
          setModalOpen(false);
          setEditGoalId(null);
        }}
      />
    </>
  );
}
