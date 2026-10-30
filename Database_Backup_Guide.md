# Back up the current RecceFlow database

The normal project's configured database is **RecceFlowDb**, on **(localdb)\MSSQLLocalDB**, using **Windows Authentication**. Databases named `RecceFlow_V3_Tests_…` and `RecceFlow_V3_Restore_…` are separate test/restore copies. A more recent creation date does not make one of those the live project database.

## Backup created for this request

**30 October 2026, 18:48:52 IST:** `artifacts\backups\RecceFlowDb_20261030_184852_IST_a0fad6f7\RecceFlowDb.bak`. Keep the entire containing folder. SQL COPY_ONLY/CHECKSUM and RESTORE VERIFYONLY passed; **418 upload files and 9 support voice files** were copied and SHA-256 verified. The resulting `.bak` SHA-256 also matches `manifest.json`. Latest applied migration: `20261030064642_SupportIssueWorkflow`. No full restore test or database/account changes were performed by this backup run.

## Recommended: SQL plus uploaded files

From `D:\project_2026\recceflow`, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/backup-recceflow.ps1
```

This reads the project's connection configuration (including Local/environment overrides), confirms the database is online and prints its latest applied migration. It is designed for this PC's LocalDB with Windows Authentication. It does not choose the newest test database.

The script uses the installed SQL Server command-line utility `sqlcmd`; it does not depend on the older PowerShell SQL driver's encryption support. No app connection settings are changed.

Each run creates a unique folder under **artifacts\backups**, labelled with India time. It creates a full `.bak` using COPY_ONLY and CHECKSUM, runs RESTORE VERIFYONLY, copies **artifacts\uploads** and **artifacts\support-uploads**, and compares each copied file's SHA-256. `manifest.json` records the database, applied migration, checksums and media counts without storing the connection string or plaintext passwords. It does not stop the app, alter accounts, delete files, overwrite older backups or restore over a database.

Avoid editing/submitting/uploading while taking a backup so SQL and external media remain aligned. Copy the **whole resulting folder** to another private drive or backup location; keeping it only on the project drive does not protect against that drive failing. Photos, marked views, voice notes and chat attachments are not all stored inside the `.bak`.

To inspect the configured target without writing a backup:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/backup-recceflow.ps1 -InspectOnly
```

To use another backup directory on this same PC:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/backup-recceflow.ps1 -OutputRoot "D:\RecceFlow_Backups"
```

SQL Server needs write access to the destination. For a remote/server SQL instance, use its own server-side backup directory and procedure; the local script deliberately rejects remote targets.

## SQL-only script in SSMS

Open **tools\backup-recceflow.sql** in SQL Server Management Studio, connect to **(localdb)\MSSQLLocalDB**, check `@Database` and `@BackupDirectory`, and Execute. The directory must exist. This generates a uniquely named verified `.bak`; it does not copy uploads. Use the PowerShell script for a complete project-data backup.

## Recover later

`RESTORE VERIFYONLY` checks the backup's readability/checksums; it is not proof of a successful full restore. Before relying on the backup, test it through **SSMS → Databases → Restore Database → Device**, choosing the `.bak` and a **new database name** such as `RecceFlow_Recovery_Test_20261030`. In Files, relocate every data/log file to unique paths on D:. Do not enable overwrite/REPLACE against RecceFlowDb for this check.

After a successful test restore, inspect the jobs/forms/materials and restore the matching `uploads` and `support-uploads` directories into an isolated project copy before testing photos/audio. Keep the current working database and media intact until the recovered copy is verified. An actual cutover or overwrite requires a separate deliberate restore operation; no destructive automatic restore script is included.

SQL backups preserve account password hashes, not recoverable plaintext passwords. Keep backups private. The separately hosted client prototype uses local browser storage and is not contained in RecceFlowDb; its JSON demo backups are separate.
