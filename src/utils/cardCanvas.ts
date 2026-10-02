import { Character } from '../types';
import { CHARACTER_PORTRAITS } from '../assets/imagePaths';

/**
 * Generates and downloads a high-resolution Nevermore Academy Student ID card.
 * Loads and renders the character's real photo portrait onto the canvas!
 */
export async function downloadNevermoreIdCard(
  character: Character,
  studentName: string,
  matriculaId: string
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 760;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background - Deep raven black with subtle gothic violet vignette
  const grad = ctx.createRadialGradient(600, 380, 50, 600, 380, 600);
  grad.addColorStop(0, '#151022');
  grad.addColorStop(0.7, '#0c0a13');
  grad.addColorStop(1, '#050407');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 760);

  // Outer gothic borders
  ctx.strokeStyle = '#4c1d95';
  ctx.lineWidth = 6;
  ctx.strokeRect(28, 28, 1144, 704);

  ctx.strokeStyle = '#9333ea';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, 1128, 688);

  ctx.strokeStyle = '#2e1065';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 1112, 672);

  // Corner gothic cross-markers
  const drawCornerFlourish = (x: number, y: number) => {
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 16, y);
    ctx.lineTo(x + 16, y);
    ctx.moveTo(x, y - 16);
    ctx.lineTo(x, y + 16);
    ctx.stroke();

    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  drawCornerFlourish(56, 56);
  drawCornerFlourish(1144, 56);
  drawCornerFlourish(56, 704);
  drawCornerFlourish(1144, 704);

  // Top Header Banner
  ctx.fillStyle = '#f3e8ff';
  ctx.font = 'bold 36px "Cinzel", serif, Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('NEVERMORE ACADEMY', 600, 95);

  ctx.fillStyle = '#a855f7';
  ctx.font = '15px "Cinzel", serif, Georgia';
  ctx.fillText('ACADEMIA NUNCA MÁS  •  SANCTUARIUM EXCLUSORUM  •  EST. 1791', 600, 125);

  // Divider line
  ctx.strokeStyle = '#6b21a8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(120, 145);
  ctx.lineTo(1080, 145);
  ctx.stroke();

  // Left Column: Portrait Box
  const portraitX = 90;
  const portraitY = 175;
  const portraitW = 320;
  const portraitH = 430;

  // Background box for portrait
  ctx.fillStyle = '#0a0812';
  ctx.fillRect(portraitX, portraitY, portraitW, portraitH);
  ctx.strokeStyle = '#7e22ce';
  ctx.lineWidth = 2;
  ctx.strokeRect(portraitX, portraitY, portraitW, portraitH);

  // Attempt to load and draw character photo portrait
  const portraitUrl = CHARACTER_PORTRAITS[character.id];
  let photoDrawn = false;
  if (portraitUrl) {
    try {
      const img = new Image();
      // Only set crossOrigin if the image is from an external remote domain
      if (portraitUrl.startsWith('http://') || portraitUrl.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }
      img.src = portraitUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
      });

      // Save context & clip to portrait rounded bounds
      ctx.save();
      ctx.beginPath();
      ctx.rect(portraitX + 10, portraitY + 10, portraitW - 20, 240);
      ctx.clip();
      ctx.drawImage(img, portraitX + 10, portraitY + 10, portraitW - 20, 240);
      ctx.restore();

      // Border around photo
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 1;
      ctx.strokeRect(portraitX + 10, portraitY + 10, portraitW - 20, 240);
      photoDrawn = true;
    } catch {
      photoDrawn = false;
    }
  }

  if (!photoDrawn) {
    ctx.font = '84px serif';
    ctx.textAlign = 'center';
    ctx.fillText(character.emoji, portraitX + portraitW / 2, portraitY + 130);
  }

  // Character Name below photo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Cinzel", serif, Georgia';
  ctx.textAlign = 'center';
  ctx.fillText(character.name.toUpperCase(), portraitX + portraitW / 2, portraitY + 285);

  ctx.fillStyle = '#d8b4fe';
  ctx.font = 'italic 14px Georgia, serif';
  const roleLines = wrapText(ctx, character.outcastTitle, 280);
  roleLines.forEach((line, idx) => {
    ctx.fillText(line, portraitX + portraitW / 2, portraitY + 312 + idx * 20);
  });

  // Dormitory
  ctx.fillStyle = '#9ca3af';
  ctx.font = '12px sans-serif';
  ctx.fillText(character.dormitory, portraitX + portraitW / 2, portraitY + 355);

  // Matricula Badge
  ctx.fillStyle = '#3b0764';
  ctx.fillRect(portraitX + 20, portraitY + 375, portraitW - 40, 40);
  ctx.strokeStyle = '#9333ea';
  ctx.lineWidth = 1;
  ctx.strokeRect(portraitX + 20, portraitY + 375, portraitW - 40, 40);

  ctx.fillStyle = '#f3e8ff';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText(matriculaId, portraitX + portraitW / 2, portraitY + 400);

  // Right Column: Student Details
  const infoX = 450;
  ctx.textAlign = 'left';

  // Student Identity Section
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 15px "Cinzel", serif, Georgia';
  ctx.fillText('ESTUDIANTE TITULAR:', infoX, 195);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px "Cinzel", serif, Georgia';
  ctx.fillText(studentName || 'Excluido Anónimo', infoX, 235);

  // Superpower / Skill
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 14px "Cinzel", serif, Georgia';
  ctx.fillText('HABILIDAD / DON DE EXCLUIDO:', infoX, 280);

  ctx.fillStyle = '#f3e8ff';
  ctx.font = '16px Georgia, serif';
  const skillLines = wrapText(ctx, character.superpower, 650);
  skillLines.forEach((line, idx) => {
    ctx.fillText(line, infoX, 308 + idx * 22);
  });

  // Iconic quote
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 14px "Cinzel", serif, Georgia';
  ctx.fillText('DIVISA EMBLEMÁTICA:', infoX, 375);

  ctx.fillStyle = '#e9d5ff';
  ctx.font = 'italic 16px Georgia, serif';
  const quoteLines = wrapText(ctx, `"${character.iconicQuote}"`, 650);
  quoteLines.forEach((line, idx) => {
    ctx.fillText(line, infoX, 403 + idx * 22);
  });

  // Analysis / Why
  ctx.fillStyle = '#c084fc';
  ctx.font = 'bold 14px "Cinzel", serif, Georgia';
  ctx.fillText('DICTAMEN DEL PORTAL:', infoX, 475);

  ctx.fillStyle = '#d1d5db';
  ctx.font = '15px Georgia, serif';
  const whyLines = wrapText(ctx, character.shortWhy, 650);
  whyLines.slice(0, 3).forEach((line, idx) => {
    ctx.fillText(line, infoX, 503 + idx * 22);
  });

  // Footer: Signatures & Seal
  ctx.strokeStyle = '#4c1d95';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(infoX, 600);
  ctx.lineTo(1080, 600);
  ctx.stroke();

  ctx.fillStyle = '#9ca3af';
  ctx.font = '13px sans-serif';
  ctx.fillText('Dirección: Larissa Weems', infoX, 630);
  ctx.fillText('Validado: Guardián del Portal Sombrío', infoX, 652);

  // Gothic Wax Seal Stamp
  const sealX = 1000;
  const sealY = 640;
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.arc(sealX, sealY, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#f3e8ff';
  ctx.font = 'bold 11px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.fillText('VERITAS', sealX, sealY - 10);
  ctx.fillText('EXCLUSIS', sealX, sealY + 3);
  ctx.fillText('NEVERMORE', sealX, sealY + 16);

  // Trigger download
  const imageUri = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `Credencial_Nevermore_${character.name.replace(/\s+/g, '_')}.png`;
  link.href = imageUri;
  link.click();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
