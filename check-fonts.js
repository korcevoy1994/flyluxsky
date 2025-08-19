#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска файлов
function findFiles(dir, extensions = ['.tsx', '.ts', '.css', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Пропускаем node_modules, .next, .git
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(file)) {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Функция для проверки шрифтов в файле
function checkFontsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Паттерны для поиска использования шрифтов
  const patterns = [
    {
      regex: /font-inter/g,
      type: 'CSS class',
      description: 'Использование font-inter класса'
    },
    {
      regex: /fontFamily.*['"]Inter['"]|['"]Inter['"].*fontFamily/g,
      type: 'Inline style',
      description: 'Inline стиль с Inter шрифтом'
    },
    {
      regex: /font-family.*Inter/gi,
      type: 'CSS property',
      description: 'CSS свойство font-family с Inter'
    },
    {
      regex: /--font-inter/g,
      type: 'CSS variable',
      description: 'CSS переменная --font-inter'
    },
    {
      regex: /from.*['"]next\/font\/google['"].*Inter/g,
      type: 'Import',
      description: 'Импорт Inter шрифта'
    }
  ];
  
  const lines = content.split('\n');
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(content)) !== null) {
      // Найти номер строки
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split('\n').length;
      const lineContent = lines[lineNumber - 1];
      
      issues.push({
        file: filePath,
        line: lineNumber,
        type: pattern.type,
        description: pattern.description,
        content: lineContent.trim(),
        match: match[0]
      });
    }
  });
  
  return issues;
}

// Основная функция
function checkAllFonts() {
  console.log('🔍 Проверка шрифтов на сайте...');
  console.log('=' .repeat(50));
  
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Папка src не найдена!');
    process.exit(1);
  }
  
  const files = findFiles(srcDir);
  console.log(`📁 Найдено ${files.length} файлов для проверки`);
  
  let totalIssues = 0;
  const issuesByType = {};
  
  files.forEach(file => {
    const issues = checkFontsInFile(file);
    
    if (issues.length > 0) {
      totalIssues += issues.length;
      
      console.log(`\n📄 ${path.relative(process.cwd(), file)}:`);
      
      issues.forEach(issue => {
        console.log(`  ⚠️  Строка ${issue.line}: ${issue.description}`);
        console.log(`     Тип: ${issue.type}`);
        console.log(`     Найдено: ${issue.match}`);
        console.log(`     Контекст: ${issue.content}`);
        
        // Подсчет по типам
        if (!issuesByType[issue.type]) {
          issuesByType[issue.type] = 0;
        }
        issuesByType[issue.type]++;
      });
    }
  });
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 СВОДКА:');
  
  if (totalIssues === 0) {
    console.log('✅ Проблем с шрифтами не найдено! Везде используется Poppins.');
  } else {
    console.log(`❌ Найдено ${totalIssues} проблем с шрифтами:`);
    
    Object.entries(issuesByType).forEach(([type, count]) => {
      console.log(`   • ${type}: ${count}`);
    });
    
    console.log('\n💡 РЕКОМЕНДАЦИИ:');
    console.log('   1. Замените все font-inter на font-poppins');
    console.log('   2. Замените все fontFamily: "Inter" на fontFamily: "Poppins"');
    console.log('   3. Обновите CSS переменные и импорты');
    console.log('   4. Проверьте глобальные стили в globals.css');
  }
  
  console.log('\n🎯 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:');
  console.log('   Все элементы должны использовать шрифт Poppins');
  console.log('   Допустимые классы: font-poppins, font-ubuntu');
  console.log('   Недопустимые: font-inter, любые упоминания Inter');
}

// Запуск проверки
if (require.main === module) {
  checkAllFonts();
}

module.exports = { checkAllFonts, findFiles, checkFontsInFile };