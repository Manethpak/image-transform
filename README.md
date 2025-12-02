# imgt - Image Transform CLI

A simple and fast CLI tool for compressing images and converting them to base64.

## Features

- Compress images with configurable quality
- Convert images to base64 (with or without data URI)
- Decode base64 from files back to images
- Resize images while compressing
- Support for multiple formats: JPEG, PNG, WebP
- Show compression statistics

## Installation

### Method 1: Install Globally (Recommended)

From the project directory:

```bash
npm install -g .
```

Now you can use `imgt` from anywhere:

```bash
imgt compress image.jpg
```

### Method 2: Link for Development

From the project directory:

```bash
npm link
```

This creates a symbolic link, perfect for development. Changes to the code take effect immediately.

### Method 3: Use with npx (No Installation)

```bash
npx imgt compress image.jpg
```

## Usage

### Compress Images

Basic compression:

```bash
imgt compress input.jpg
# Creates: compressed_input.jpeg
```

Specify output file:

```bash
imgt compress input.jpg output.jpg
```

Set quality (1-100, default 80):

```bash
imgt compress input.jpg -q 90
```

Change output format:

```bash
imgt compress input.jpg -f webp
imgt compress input.jpg -f png
```

Resize while compressing:

```bash
imgt compress input.jpg --width 800
imgt compress input.jpg --width 800 --height 600
```

Compress and output as base64:

```bash
imgt compress input.jpg -b
imgt compress input.jpg -b output.txt
```

### Convert to Base64

Convert image to base64 with data URI:

```bash
imgt base64 input.jpg
# Output: data:image/jpeg;base64,/9j/4AAQSkZJRg...
```

Save to file:

```bash
imgt base64 input.jpg output.txt
```

Get raw base64 (without data URI):

```bash
imgt base64 input.jpg --raw
```

### Decode Base64 to Image

Decode base64 data from a file and save as an image:

```bash
imgt decode base64.txt output.jpg
```

The decode command automatically detects and handles:

- Raw base64 strings
- Data URI format (e.g., `data:image/jpeg;base64,...`)

Output format is determined by the file extension:

```bash
imgt decode base64.txt output.png
imgt decode base64.txt output.webp
```

### Serve Web Page

Start a web server to serve the encode/decode page:

```bash
imgt serve
# Starts server on port 3020
```

Specify a custom port:

```bash
imgt serve -p 8080
```

## Examples

### Compress a photo for web use

```bash
imgt compress photo.jpg web-photo.jpg -q 85 -f webp
```

### Create a thumbnail

```bash
imgt compress photo.jpg thumbnail.jpg --width 200 -q 75
```

### Get base64 for HTML embedding

```bash
imgt base64 logo.png > logo-base64.txt
```

### Batch compress multiple images

```bash
for img in *.jpg; do imgt compress "$img" "compressed_$img" -q 80; done
```

### Convert to base64 and back

```bash
# Convert image to base64
imgt base64 photo.jpg photo-base64.txt

# Decode it back to an image
imgt decode photo-base64.txt restored-photo.jpg
```

## Options

### Compress Command

```
Usage: imgt compress [options] <input> [output]

Arguments:
  input                    Input image path
  output                   Output image path (optional)

Options:
  -q, --quality <number>   Quality level (1-100) (default: "80")
  -f, --format <format>    Output format (jpeg, png, webp) (default: "jpeg")
  --width <number>         Resize width (optional)
  --height <number>        Resize height (optional)
  -b, --base64             Output as base64 instead of file
```

### Base64 Command

```
Usage: imgt base64 [options] <input> [output]

Arguments:
  input       Input image path
  output      Output file path (optional, prints to stdout if not provided)

Options:
  --raw       Output raw base64 without data URI prefix
```

### Decode Command

```
Usage: imgt decode <input> <output>

Arguments:
  input       Input file containing base64 data
  output      Output image path

The command automatically handles both raw base64 and data URI formats.
Output format is determined by the file extension (.jpg, .png, .webp, etc.)
```

### Serve Command

```
Usage: imgt serve [options]

Options:
  -p, --port <number>   Port to serve on (default: "3000")
```

## Requirements

- Node.js 14 or higher

## License

ISC
