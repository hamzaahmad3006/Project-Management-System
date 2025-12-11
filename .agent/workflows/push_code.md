---
description: Push code to both Personal and Organization GitHub repositories
---

This workflow will:
1.  Initialize Git.
2.  Add both `origin` (Personal) and `organization` remotes.
3.  Commit all changes.
4.  Push to both repositories.

### Repositories
- **Personal (Origin):** `https://github.com/hamzaahmad3006/Project-Management-System.git`
- **Organization:** `https://github.com/bootcampwise/Project3-Project-Management-System.git`

### Steps

1.  **Initialize & Configure Remotes**
    ```powershell
    git init
    git branch -M main
    git remote add origin https://github.com/hamzaahmad3006/Project-Management-System.git
    git remote add organization https://github.com/bootcampwise/Project3-Project-Management-System.git
    ```

2.  **Commit Changes**
    ```powershell
    echo "# Project-Management-System" >> README.md
    git add .
    git commit -m "Initial commit: Project setup and feature implementation"
    ```

3.  **Push to Personal Repo**
    ```powershell
    // turbo
    git push -u origin main
    ```

4.  **Push to Organization Repo**
    ```powershell
    // turbo
    git push -u organization main
    ```
