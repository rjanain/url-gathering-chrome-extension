# Cross-Platform Git Setup Instructions

To ensure consistent file handling across Windows, macOS, and Linux, all team members should follow these setup steps:

## 1. Configure Git Settings

Run these commands in your local repository:

```bash
# Disable automatic CRLF conversion (we handle this with .gitattributes)
git config core.autocrlf false

# Disable file mode change detection (prevents permission-based false changes)
git config core.filemode false

# Ensure consistent line ending handling
git config core.eol lf
```

## 2. For Windows Users (Additional Steps)

If you're using Windows, also run:

```bash
# Configure git to use LF line endings in the repository
git config core.autocrlf input
```

## 3. Verify Your Setup

Check your configuration:

```bash
git config --list | grep -E "(core\.autocrlf|core\.eol|core\.filemode)"
```

Expected output:
- `core.filemode=false`
- `core.autocrlf=false` (or `input` for Windows)
- `core.eol=lf`

## 4. Editor Configuration

### VS Code
Add this to your workspace settings (`.vscode/settings.json`):

```json
{
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

### Other Editors
Configure your editor to:
- Use LF (`\n`) line endings
- Insert final newline
- Trim trailing whitespace

## 5. Troubleshooting

If you see unexpected file changes after switching branches or pulling:

```bash
# Refresh the repository with proper line endings
git rm --cached -r .
git reset .
git add .
```

## What This Setup Prevents

1. **Line ending issues**: Different line endings (CRLF vs LF) showing as changes
2. **File permission changes**: Unnecessary permission changes between platforms
3. **Binary file corruption**: Prevents git from trying to convert binary files
4. **False diffs**: Eliminates whitespace-only changes in diffs

## Files Affected

The `.gitattributes` file in this repository defines how git should handle:
- Text files (`.js`, `.json`, `.html`, `.css`, `.md`, etc.)
- Binary files (images, fonts, archives)
- Special files (package files, configs)

All text files are normalized to use LF line endings in the repository.
