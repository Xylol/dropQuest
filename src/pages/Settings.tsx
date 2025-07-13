import { useState, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { DataPortabilityService } from "../services/DataPortabilityService";

import BottomNav from "../components/BottomNav";
import Button from "../components/Button";

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string>("");
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);
  
  const dataService = new DataPortabilityService();
  const dataSummary = dataService.getDataSummary();

  const handleExport = () => {
    try {
      dataService.downloadData();
    } catch (error) {
      alert("Failed to export data. Please try again.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };


  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportMessage("");
    setImportSuccess(null);

    try {
      const result = await dataService.importFromFile(file, { replace: false });
      
      if (result.success) {
        setImportSuccess(true);
        setImportMessage(
          `Successfully imported ${result.playersImported} players and ${result.itemsImported} items!`
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setImportSuccess(false);
        setImportMessage(result.error || "Import failed");
      }
    } catch (error) {
      setImportSuccess(false);
      setImportMessage("Unexpected error during import");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  const handleClearData = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL your data? This cannot be undone!\n\n" +
      "We recommend exporting your data first as a backup."
    );
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        "This is your final warning! All players and items will be permanently deleted.\n\n" +
        "Click OK to delete everything, or Cancel to abort."
      );
      
      if (doubleConfirm) {
        dataService.clearAllData();
        alert("All data has been cleared.");
        navigate("/");
      }
    }
  };

  return (
    <div style={{ 
      padding: "var(--space-m)", 
      maxWidth: "600px", 
      margin: "0 auto",
      minHeight: "100vh"
    }}>
      <div style={{ marginBottom: "var(--space-m)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--font-size-xl)" }}>Settings</h1>
      </div>

      {/* Data Summary */}
      <div style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "var(--space-s)",
        marginBottom: "var(--space-m)"
      }}>
        <h2 style={{ margin: "0 0 var(--space-s) 0", fontSize: "var(--font-size-lg)" }}>
          Your Data
        </h2>
        <div style={{ color: "var(--color-text-secondary)" }}>
          <p style={{ margin: "0.25rem 0" }}>Players: {dataSummary.players}</p>
          <p style={{ margin: "0.25rem 0" }}>Items: {dataSummary.items}</p>
          <p style={{ margin: "0.25rem 0" }}>Total size: {dataSummary.totalSize}</p>
        </div>
      </div>

      {/* Export Section */}
      <div style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "var(--space-s)",
        marginBottom: "var(--space-m)"
      }}>
        <h2 style={{ margin: "0 0 var(--space-s) 0", fontSize: "var(--font-size-lg)" }}>
          Export Data
        </h2>
        <p style={{ 
          margin: "0 0 var(--space-s) 0", 
          color: "var(--color-text-secondary)",
          fontSize: "0.9rem"
        }}>
          Download all your data as a JSON file. Use this to backup your progress or transfer to another device.
        </p>
        <Button onClick={handleExport} style={{ width: "100%" }}>
          Download Backup File
        </Button>
      </div>

      {/* Import Section */}
      <div style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius)",
        padding: "var(--space-s)",
        marginBottom: "var(--space-m)"
      }}>
        <h2 style={{ margin: "0 0 var(--space-s) 0", fontSize: "var(--font-size-lg)" }}>
          Import Data
        </h2>
        <p style={{ 
          margin: "0 0 var(--space-s) 0", 
          color: "var(--color-text-secondary)",
          fontSize: "0.9rem"
        }}>
          Upload a DropQuest backup file to restore your data. Existing data will be preserved and merged with imported data.
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        
        <Button 
          onClick={handleImportClick}
          disabled={isImporting}
          style={{ width: "100%", marginBottom: "var(--space-s)" }}
        >
          {isImporting ? "Importing..." : "Choose Backup File"}
        </Button>

        {importMessage && (
          <div style={{
            padding: "var(--space-s)",
            borderRadius: "var(--radius)",
            background: importSuccess ? "var(--color-green)" : "var(--color-destructive)",
            color: "var(--color-text)",
            fontSize: "0.9rem"
          }}>
            {importMessage}
          </div>
        )}
      </div>


      {/* Danger Zone */}
      <div style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-destructive)",
        borderRadius: "var(--radius)",
        padding: "var(--space-s)"
      }}>
        <h2 style={{ 
          margin: "0 0 var(--space-s) 0", 
          fontSize: "var(--font-size-lg)",
          color: "var(--color-destructive)"
        }}>
          Danger Zone
        </h2>
        <p style={{ 
          margin: "0 0 var(--space-s) 0", 
          color: "var(--color-text-secondary)",
          fontSize: "0.9rem"
        }}>
          Permanently delete all your data. This action cannot be undone!
        </p>
        <Button 
          onClick={handleClearData}
          variant="destructive"
          style={{ width: "100%" }}
        >
          Delete All Data
        </Button>
      </div>

      {/* Privacy Notice */}
      <div style={{
        marginTop: "var(--space-m)",
        padding: "var(--space-s)",
        color: "var(--color-text-secondary)",
        fontSize: "0.8rem",
        textAlign: "center",
        marginBottom: "80px"
      }}>
        <p style={{ margin: 0 }}>
          All your data is stored locally in your browser and never sent to any server. 
          Export your data regularly to avoid losing progress.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}