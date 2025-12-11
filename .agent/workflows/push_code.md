---
description: Push code to both Personal and Organization GitHub repositories
---

This workflow will:
1.  Stage all changes.
2.  Commit changes with a "Work in progress" message (or you can edit it).
3.  Push to both `origin` (Personal) and `organization` (Organization) repositories.

**Note:** This workflow assumes the repository is already initialized and remotes are set.

### Steps

1.  **Stage & Commit Changes**
    ```powershell
    git add .
    git commit -m "Update project changes"
    ```

2.  **Push to Organization**
    ```powershell
    // turbo
    git push -u organization main
    ```

3.  **Push to Personal Repo**
    ```powershell
    // turbo
    git push -u origin main
    ```
