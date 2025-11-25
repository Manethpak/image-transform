#!/usr/bin/env node

const { Command } = require('commander');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .name('imgt')
  .description('A simple CLI tool for compressing images and converting them to base64')
  .version('1.0.0');

// Compress command
program
  .command('compress')
  .description('Compress an image')
  .argument('<input>', 'Input image path')
  .argument('[output]', 'Output image path (optional)')
  .option('-q, --quality <number>', 'Quality level (1-100)', '80')
  .option('-f, --format <format>', 'Output format (jpeg, png, webp)', 'jpeg')
  .option('--width <number>', 'Resize width (optional)')
  .option('--height <number>', 'Resize height (optional)')
  .option('-b, --base64', 'Output as base64 instead of file')
  .action(async (input, output, options) => {
    try {
      if (!fs.existsSync(input)) {
        console.error(`Error: Input file '${input}' not found`);
        process.exit(1);
      }

      const quality = parseInt(options.quality);
      if (isNaN(quality) || quality < 1 || quality > 100) {
        console.error('Error: Quality must be a number between 1 and 100');
        process.exit(1);
      }

      let pipeline = sharp(input);

      // Resize if dimensions provided
      if (options.width || options.height) {
        pipeline = pipeline.resize({
          width: options.width ? parseInt(options.width) : undefined,
          height: options.height ? parseInt(options.height) : undefined,
          fit: 'inside'
        });
      }

      // Set format and quality
      const format = options.format.toLowerCase();
      switch (format) {
        case 'jpeg':
        case 'jpg':
          pipeline = pipeline.jpeg({ quality });
          break;
        case 'png':
          pipeline = pipeline.png({ quality });
          break;
        case 'webp':
          pipeline = pipeline.webp({ quality });
          break;
        default:
          console.error(`Error: Unsupported format '${format}'. Use jpeg, png, or webp`);
          process.exit(1);
      }

      if (options.base64) {
        // Output as base64
        const buffer = await pipeline.toBuffer();
        const base64 = buffer.toString('base64');
        const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
        const dataUri = `data:${mimeType};base64,${base64}`;
        
        if (output) {
          fs.writeFileSync(output, dataUri);
          console.log(`Base64 saved to: ${output}`);
        } else {
          console.log(dataUri);
        }
      } else {
        // Output as file
        const outputPath = output || `compressed_${path.basename(input, path.extname(input))}.${format}`;
        await pipeline.toFile(outputPath);
        
        const inputStats = fs.statSync(input);
        const outputStats = fs.statSync(outputPath);
        const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);
        
        console.log(`Compressed successfully!`);
        console.log(`Input: ${(inputStats.size / 1024).toFixed(2)} KB`);
        console.log(`Output: ${(outputStats.size / 1024).toFixed(2)} KB`);
        console.log(`Reduction: ${reduction}%`);
        console.log(`Saved to: ${outputPath}`);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Base64 command
program
  .command('base64')
  .description('Convert an image to base64')
  .argument('<input>', 'Input image path')
  .argument('[output]', 'Output file path (optional, prints to stdout if not provided)')
  .option('--raw', 'Output raw base64 without data URI prefix')
  .action(async (input, output, options) => {
    try {
      if (!fs.existsSync(input)) {
        console.error(`Error: Input file '${input}' not found`);
        process.exit(1);
      }

      const buffer = await sharp(input).toBuffer();
      const base64 = buffer.toString('base64');
      
      let result;
      if (options.raw) {
        result = base64;
      } else {
        const ext = path.extname(input).toLowerCase();
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.webp') mimeType = 'image/webp';
        else if (ext === '.gif') mimeType = 'image/gif';
        
        result = `data:${mimeType};base64,${base64}`;
      }

      if (output) {
        fs.writeFileSync(output, result);
        console.log(`Base64 saved to: ${output}`);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Decode base64 to image
program
  .command('decode')
  .description('Decode base64 from a file and save as an image')
  .argument('<input>', 'Input file containing base64 data')
  .argument('<output>', 'Output image path')
  .action(async (input, output) => {
    try {
      if (!fs.existsSync(input)) {
        console.error(`Error: Input file '${input}' not found`);
        process.exit(1);
      }

      // Read the base64 data from file
      let base64Data = fs.readFileSync(input, 'utf8').trim();
      
      // Remove data URI prefix if present (e.g., "data:image/jpeg;base64,")
      const dataUriMatch = base64Data.match(/^data:image\/[a-z]+;base64,(.+)$/);
      if (dataUriMatch) {
        base64Data = dataUriMatch[1];
      }

      // Convert base64 to buffer
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Determine output format from extension
      const outputExt = path.extname(output).toLowerCase();
      let format = 'jpeg';
      if (outputExt === '.png') format = 'png';
      else if (outputExt === '.webp') format = 'webp';
      else if (outputExt === '.gif') format = 'gif';
      else if (outputExt === '.jpg') format = 'jpeg';

      // Use sharp to process and save the image
      await sharp(imageBuffer).toFile(output);

      const outputStats = fs.statSync(output);
      console.log(`Image decoded successfully!`);
      console.log(`Size: ${(outputStats.size / 1024).toFixed(2)} KB`);
      console.log(`Saved to: ${output}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
