import { useState } from "react";
import '../assets/style.css'
import TimerDashboard from "../components/TimerDashboard";
import CreateTimerModal from "../components/CreateTimerModal"

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  return (
    <>
      <TimerDashboard
        key={refresh}
        onCreate={() => setShowModal(true)}
      />
      <CreateTimerModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setRefresh((r) => r + 1)}
      />
    </>
  );
}
