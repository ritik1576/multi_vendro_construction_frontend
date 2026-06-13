const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/customer/Checkout.jsx',
  'src/pages/customer/MyCart.jsx',
  'src/pages/customer/ProductListing.jsx',
  'src/pages/customer/ProductDetail.jsx',
  'src/pages/customer/OrderHistory.jsx',
  'src/pages/customer/OrderDetail.jsx',
];

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import
  content = content.replace(/import\s+\{\s*(PageContainer|Card|Button|Input)[^}]*\}\s+from\s+['"][^'"]*UIComponents['"];?\n?/g, '');

  // PageContainer
  content = content.replace(/<PageContainer(\s+customNavbar=\{([^}]+)\})?>/g, (match, p1, p2) => {
    if (p2) {
      return `<div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">\n      {${p2}}\n      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">`;
    }
    return `<div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col">\n      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">`;
  });
  content = content.replace(/<\/PageContainer>/g, '</main>\n    </div>');

  // Card
  content = content.replace(/<Card([^>]*)>/g, (match, props) => {
    let classNameStr = 'rounded-xl border border-slate-200 bg-white p-6 shadow-sm';
    let newProps = props;
    
    // Extract className if exists
    const classMatch = props.match(/className=(["'{])(.*?)(\1|\})/);
    if (classMatch) {
      if (classMatch[1] === '"' || classMatch[1] === "'") {
        classNameStr += ` ${classMatch[2]}`;
      } else if (classMatch[1] === '{') {
        const expr = props.match(/className=\{([^}]+)\}/)[1];
        if (expr.startsWith('`')) {
          const inner = expr.slice(1, -1);
          classNameStr += ` ${inner}`;
        } else {
          classNameStr += ` \${${expr}}`;
        }
      }
      newProps = props.replace(/className=(["'{])(.*?)(\1|\})/, '');
    }
    
    if (classNameStr.includes('${')) {
      return `<div className={\`${classNameStr}\`} ${newProps}>`;
    } else {
      return `<div className="${classNameStr}" ${newProps}>`;
    }
  });
  content = content.replace(/<\/Card>/g, '</div>');

  // Input
  content = content.replace(/<Input\s*([^>]*)(\/?)>/g, (match, props, selfClose) => {
    let classNameStr = 'w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] bg-white transition-all';
    let newProps = props;
    
    const classMatch = props.match(/className=(["'{])(.*?)(\1|\})/);
    if (classMatch) {
      if (classMatch[1] === '"' || classMatch[1] === "'") {
        classNameStr += ` ${classMatch[2]}`;
      } else if (classMatch[1] === '{') {
         const expr = props.match(/className=\{([^}]+)\}/)[1];
         classNameStr += ` \${${expr}}`;
      }
      newProps = props.replace(/className=(["'{])(.*?)(\1|\})/, '');
    }
    
    if (classNameStr.includes('${')) {
      return `<input className={\`${classNameStr}\`} ${newProps}${selfClose ? '/' : ''}>`;
    } else {
      return `<input className="${classNameStr}" ${newProps}${selfClose ? '/' : ''}>`;
    }
  });

  // Button
  content = content.replace(/<Button([^>]*)>/g, (match, props) => {
    let baseClass = 'inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-extrabold transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    let variant = 'primary';
    let newProps = props;
    
    const variantMatch = props.match(/variant=["']([^"']+)["']/);
    if (variantMatch) {
      variant = variantMatch[1];
      newProps = props.replace(/variant=["']([^"']+)["']/, '');
    }
    
    if (variant === 'primary') baseClass += ' bg-[#F97316] text-white hover:bg-[#EA580C] shadow-sm';
    else if (variant === 'secondary') baseClass += ' bg-[#1E3A8A] text-white hover:bg-[#172554] shadow-sm';
    else if (variant === 'tertiary') baseClass += ' bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold';
    else if (variant === 'danger') baseClass += ' text-red-500 hover:text-red-700 hover:underline font-bold px-0 h-auto bg-transparent';
    
    let classNameStr = baseClass;
    const classMatch = newProps.match(/className=(["'{])(.*?)(\1|\})/);
    if (classMatch) {
      if (classMatch[1] === '"' || classMatch[1] === "'") {
        classNameStr += ` ${classMatch[2]}`;
      } else if (classMatch[1] === '{') {
         const expr = newProps.match(/className=\{([^}]+)\}/)[1];
         classNameStr += ` \${${expr}}`;
      }
      newProps = newProps.replace(/className=(["'{])(.*?)(\1|\})/, '');
    }
    
    if (classNameStr.includes('${')) {
      return `<button className={\`${classNameStr}\`} ${newProps}>`;
    } else {
      return `<button className="${classNameStr}" ${newProps}>`;
    }
  });
  content = content.replace(/<\/Button>/g, '</button>');

  fs.writeFileSync(filePath, content, 'utf8');
};

files.forEach(replaceInFile);
console.log('Replacements completed.');
