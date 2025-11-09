import { useEffect, useState, useCallback } from "react";
import {
  Page,
  Layout,
  LegacyCard,
  ResourceList,
  Text,
  Box,
  Spinner,
  EmptyState,
  Button,
  Select,
  Modal,
  TextContainer,
  Frame,
  Toast,
  Icon,
} from "@shopify/polaris";
import { PlusMinor, EditMinor, DeleteMinor } from "@shopify/polaris-icons";
import CreateTimerModal from "./CreateTimerModal";

export default function TimerDashboard() {
  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [modalOpen, setModalVisible] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ active: false, content: "", error: false });

  const showToast = useCallback((content, error = false) => {
    setToast({ active: true, content, error });
  }, []);

  const fetchTimers = async (sort = sortBy) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/timers?sortBy=${sort}`);
      const data = await res.json();
      setTimers(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Error fetching timers", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimers();
  }, [sortBy]);

  // Create / Update handler
  const handleSaveTimer = async (timerData, id = null) => {
    try {
      const url = id ? `/api/admin/timers/${id}` : `/api/admin/timers`;
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timerData),
      });

      if (!res.ok) throw new Error();

      await fetchTimers();
      setModalVisible(false);
      setSelectedTimer(null);
      showToast(id ? "Timer updated successfully!" : "Timer created successfully!");
    } catch (err) {
      showToast(`Failed to save timer ${err.message ? ':' + err.message: ''}`, true);
    }
  };

  // Delete handler
  const handleDeleteTimer = async () => {
    try {
      const res = await fetch(`/api/admin/timers/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setConfirmDelete(false);
      setDeleteId(null);
      await fetchTimers();
      showToast("Timer deleted successfully!");
    } catch (err) {
      showToast("Failed to delete timer", true);
    }
  };

  // Timer List
  const TimerList = () => {
    if (loading)
      return (
        <Box padding="400" display="flex" align="center" justify="center">
          <Spinner accessibilityLabel="Loading timers" size="large" />
        </Box>
      );

    if (!timers?.length)
      return (
        <EmptyState
          heading="No timers yet"
          action={{
            content: "Create timer",
            onAction: () => setModalVisible(true),
          }}
          // image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>Start by creating a new countdown timer for your promotions.</p>
        </EmptyState>
      );

    return (
      <LegacyCard>
        <ResourceList
          resourceName={{ singular: "timer", plural: "timers" }}
          items={timers}
          renderItem={(timer) => {
            const { _id, title, description, startDate, endDate } = timer;
            const formattedStart = new Date(startDate).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            });
            const formattedEnd = new Date(endDate).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <ResourceList.Item id={_id}>
                <Box
                  display="flex"
                  // align="center"
                  justify=""
                  padding="300"
                  style={{
                    borderBottom: "1px solid #ebebeb",
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Left: Timer info */}
                  <Box>
                    <Text as="h3" variant="headingMd">
                      {title}
                    </Text>
                    {description && (
                      <Text as="p" color="subdued">
                        {description}
                      </Text>
                    )}
                    <Box paddingBlockStart="100">
                      <Text as="p" color="subdued">
                        <strong>Start:</strong> {formattedStart} &nbsp;&nbsp;
                        <strong>End:</strong> {formattedEnd}
                      </Text>
                    </Box>
                  </Box>

                  {/* Right: Icon-only actions (centered vertically) */}
                  <Box
                    display="flex"
                    align="center"
                    justify="flex-end"
                    gap="300"
                    style={{
                      minWidth: "70px",
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedTimer(timer);
                        setModalVisible(true);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "6px",
                      }}
                      title="Edit timer"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#f6f6f7")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <Icon source={EditMinor} tone="base" />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(_id);
                        setConfirmDelete(true);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "6px",
                        borderRadius: "6px",
                      }}
                      title="Delete timer"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#fdf3f3")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <Icon source={DeleteMinor} tone="critical" />
                    </button>
                  </Box>
                </Box>
              </ResourceList.Item>
            );
          }}
        />
      </LegacyCard>
    );
  };

  const toastMarkup = toast.active ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={() => setToast({ active: false, content: "", error: false })}
      duration={2500}
    />
  ) : null;

  return (
    <Frame>
      <Page>
        {/* Header */}
        <Box
          as="div"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBlock: "var(--p-space-300)",
            paddingInline: "var(--p-space-400)",
            marginBottom: "15px",
          }}
        >
          <Box>
            <Text as="h1" variant="headingXl">
              Countdown Timer Manager
            </Text>
            <Text as="p" tone="subdued">
              Create and manage countdown timers for your promotions
            </Text>
          </Box>

          <Button
            onClick={() => {
              setSelectedTimer(null);
              setModalVisible(true);
            }}
            icon={PlusMinor}
            variant="primary"
            className="custom-black-btn"
          >
            Create timer
          </Button>
        </Box>

        {/* Sort Dropdown */}
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingInline: "var(--p-space-400)",
            marginBottom: "10px",
          }}
        >
          <Select
            label="Sort by"
            labelInline
            options={[
              { label: "Newest first", value: "newest" },
              { label: "Oldest first", value: "oldest" },
              { label: "Start date", value: "startDate" },
              { label: "End date", value: "endDate" },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          />
        </Box>

        {/* Timer List */}
        <Layout>
          <Layout.Section>
            <TimerList />
          </Layout.Section>
        </Layout>

        {/* Modals */}
        {modalOpen && (
          <CreateTimerModal
            open={modalOpen}
            onClose={() => {
              setModalVisible(false);
              setSelectedTimer(null);
            }}
            onSave={handleSaveTimer}
            timer={selectedTimer}
          />
        )}

        {confirmDelete && (
          <Modal
            open={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            title="Delete timer?"
            primaryAction={{
              content: "Delete",
              destructive: true,
              onAction: handleDeleteTimer,
            }}
            secondaryActions={[
              { content: "Cancel", onAction: () => setConfirmDelete(false) },
            ]}
          >
            <Modal.Section>
              <TextContainer>
                <p>This action cannot be undone. Are you sure?</p>
              </TextContainer>
            </Modal.Section>
          </Modal>
        )}
      </Page>
      {toastMarkup}
    </Frame>
  );
}
