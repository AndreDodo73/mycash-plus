import { useState } from "react";
import { AddMemberModal } from "../components/modals";
import { ProfileView } from "../components/profile";

export function ProfilePage() {
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);

  return (
    <>
      <ProfileView
        onAddMember={() => {
          setEditMemberId(null);
          setAddMemberOpen(true);
        }}
        onEditMember={(memberId) => {
          setEditMemberId(memberId);
          setAddMemberOpen(true);
        }}
      />

      <AddMemberModal
        open={addMemberOpen}
        editMemberId={editMemberId}
        onClose={() => {
          setAddMemberOpen(false);
          setEditMemberId(null);
        }}
      />
    </>
  );
}
