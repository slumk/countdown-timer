import React, { useState, useEffect, useCallback } from "react";
import { Modal, FormLayout, TextField, Select, Text } from "@shopify/polaris";
import { HexColorPicker } from "react-colorful";

export default function CreateTimerModal({ open, onClose, onSave, timer }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#00b894");
  const [size, setSize] = useState("Medium");
  const [position, setPosition] = useState("Top");
  const [urgency, setUrgency] = useState("None");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (timer) {
      setTitle(timer.title || "");
      setDescription(timer.description || "");
      setColor(timer.color || "#00b894");
      setSize(timer.size || "Medium");
      setPosition(timer.position || "Top");
      setUrgency(timer.urgency || "None");

      if (timer.startDate) {
        const start = new Date(timer.startDate);
        setStartDate(start.toISOString().split("T")[0]);
        setStartTime(start.toTimeString().slice(0, 5));
      }
      if (timer.endDate) {
        const end = new Date(timer.endDate);
        setEndDate(end.toISOString().split("T")[0]);
        setEndTime(end.toTimeString().slice(0, 5));
      }
    } else {
      setTitle("");
      setDescription("");
      setColor("#00b894");
      setSize("Medium");
      setPosition("Top");
      setUrgency("None");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    }
  }, [timer]);

  const handleSave = useCallback(async () => {
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    const timerData = {
      title,
      description,
      color,
      size,
      position,
      urgency,
      startDate: `${startDate}T${startTime}`,
      endDate: `${endDate}T${endTime}`,
    };

    await onSave(timerData, timer?._id);
    setSubmitting(false);
  }, [
    title,
    description,
    color,
    size,
    position,
    urgency,
    startDate,
    startTime,
    endDate,
    endTime,
    timer,
    onSave,
  ]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={timer ? "Edit Timer" : "Create New Timer"}
      primaryAction={{
        content: submitting ? "Saving..." : timer ? "Update timer" : "Create timer",
        onAction: handleSave,
        disabled: submitting,
      }}
      secondaryActions={[{ content: "Cancel", onAction: onClose }]}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Timer name"
            value={title}
            onChange={setTitle}
            autoComplete="off"
            requiredIndicator
          />

          {/* Date-Time Fields */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 16px",
              marginTop: "8px",
            }}
          >
            <div>
              <Text variant="bodyMd" as="p">
                Start date
              </Text>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #c9cccf",
                  borderRadius: "8px",
                  padding: "10px",
                  marginTop: "4px",
                }}
              />
            </div>
            <div>
              <Text variant="bodyMd" as="p">
                Start time
              </Text>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #c9cccf",
                  borderRadius: "8px",
                  padding: "10px",
                  marginTop: "4px",
                }}
              />
            </div>
            <div>
              <Text variant="bodyMd" as="p">
                End date
              </Text>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #c9cccf",
                  borderRadius: "8px",
                  padding: "10px",
                  marginTop: "4px",
                }}
              />
            </div>
            <div>
              <Text variant="bodyMd" as="p">
                End time
              </Text>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #c9cccf",
                  borderRadius: "8px",
                  padding: "10px",
                  marginTop: "4px",
                }}
              />
            </div>
          </div>

          <TextField
            label="Promotion description"
            value={description}
            onChange={setDescription}
            multiline={3}
            autoComplete="off"
          />

          <div style={{ marginTop: "16px" }}>
            <Text variant="bodyMd" as="h2">
              Timer color
            </Text>
            <HexColorPicker color={color} onChange={setColor} />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
          >
            <Select
              label="Timer size"
              options={["Small", "Medium", "Large"]}
              onChange={setSize}
              value={size}
            />
            <Select
              label="Timer position"
              options={["Top", "Bottom"]}
              onChange={setPosition}
              value={position}
            />
          </div>

          <Select
            label="Urgency notification"
            options={["None", "Color pulse", "Banner flash", "Blink"]}
            onChange={setUrgency}
            value={urgency}
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}
