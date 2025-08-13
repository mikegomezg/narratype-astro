import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const textsRoot = join(__dirname, '..', 'texts');

const categories = ['classics', 'technical', 'exercises', 'articles', 'custom'];
for (const c of categories) {
    const dir = join(textsRoot, c);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const samples = [
    {
        category: 'technical',
        filename: 'javascript_basics.txt',
        content: `# title: JavaScript Fundamentals
# author: Narratype Docs
# difficulty: Easy
# category: Technical

JavaScript variables can be declared using var, let, or const keywords. The let keyword provides block scope, while var provides function scope. Constants declared with const cannot be reassigned, making them ideal for values that should remain unchanged throughout program execution.

Functions in JavaScript can be declared in multiple ways. Function declarations are hoisted, meaning they can be called before their definition in the code. Arrow functions provide a more concise syntax and lexically bind the this value, making them particularly useful in callbacks and array methods.

Objects in JavaScript are collections of key-value pairs. They can be created using object literals, constructor functions, or the Object.create method. Properties can be accessed using dot notation or bracket notation, with bracket notation allowing for dynamic property names.

Arrays are special objects that store ordered collections of values. They come with numerous built-in methods like map, filter, and reduce that enable functional programming patterns. Understanding these methods is crucial for writing clean, efficient JavaScript code.`
    },
    {
        category: 'technical',
        filename: 'python_basics.txt',
        content: `# title: Python Programming Essentials
# author: Narratype Docs
# difficulty: Easy
# category: Technical

Python emphasizes code readability with its use of significant whitespace. Indentation defines code blocks, eliminating the need for curly braces found in many other languages. This design choice enforces consistent formatting across Python codebases.

Variables in Python are dynamically typed, meaning you don't need to declare their type explicitly. Python infers the type based on the assigned value. This flexibility allows for rapid development but requires careful attention to type-related errors during runtime.

Lists, tuples, and dictionaries are Python's primary built-in data structures. Lists are mutable ordered sequences, tuples are immutable ordered sequences, and dictionaries store key-value pairs. Each structure has specific use cases and performance characteristics.

Functions in Python are defined using the def keyword. They support default arguments, keyword arguments, and variable-length argument lists. Python also supports lambda functions for simple, one-line function definitions commonly used in functional programming constructs.`
    },
    {
        category: 'exercises',
        filename: 'home_row_practice.txt',
        content: `# title: Home Row Mastery
# author: Typing Coach
# difficulty: Easy
# category: Exercises

asdf jkl; asdf jkl; asdf jkl; fjdk slak fjdk slak fjdk slak
sad lad ask fall jak lass dad sala flask glad
alas salad flask fall sad dad ask lad jak glass

The quick fingers dance across the home row keys with practiced precision.
All good typists know that mastering the home row is fundamental.
Start slow and steady, then gradually increase your speed.

jaded flask salad falls sadly; dad asks lad
glass flask holds salsa; add salt as dad says
all lads and lasses shall ask dad; glass falls

Keep your fingers curved and relaxed on the home keys.
Focus on accuracy before speed for best results.
Practice daily to build muscle memory and confidence.`
    },
    {
        category: 'exercises',
        filename: 'number_practice.txt',
        content: `# title: Number Row Training
# author: Typing Coach
# difficulty: Medium
# category: Exercises

123 456 789 0 123 456 789 0 123 456 789 0
The year 2024 marks significant technological advancement.
Calculate 1234 plus 5678 equals 6912 for practice.

Phone numbers like 555-0123 and 867-5309 are memorable.
ZIP codes range from 00501 to 99950 across the nation.
Practice typing dates: 01/01/2024, 12/31/2023, 06/15/2025.

Mix letters and numbers: Building 42A, Suite 301B, Unit 7C.
Serial numbers often combine both: XY123Z, AB456C, QR789P.
Time stamps require precision: 10:30:45 AM, 23:59:59 PM.

The combination of numbers and letters challenges coordination.
Your fingers must move smoothly between the number row and letters.
Consistent practice with mixed content improves overall typing speed.`
    },
    {
        category: 'articles',
        filename: 'typing_tips.txt',
        content: `# title: Effective Typing Practice Strategies
# author: Narratype Guide
# difficulty: Medium
# category: Articles

Developing excellent typing skills requires consistent practice and proper technique. Begin by ensuring your posture is correct: sit straight with feet flat on the floor, elbows at ninety degrees, and wrists floating above the keyboard. Your monitor should be at eye level to prevent neck strain during extended practice sessions.

The foundation of touch typing is knowing the home row position without looking. Place your left fingers on ASDF and right fingers on JKL; with thumbs resting on the space bar. Each finger is responsible for specific keys, and maintaining this discipline is crucial for developing speed and accuracy.

Start with accuracy rather than speed. It's better to type slowly without errors than to type quickly with many mistakes. Errors break your rhythm and require backspacing, which ultimately slows you down more than typing carefully in the first place.

Practice regularly but in short sessions. Fifteen to twenty minutes of focused practice daily is more effective than occasional long sessions. Your brain needs time to consolidate the motor patterns you're developing. Consistency is key to building lasting muscle memory.

Use varied content for practice to expose yourself to different letter combinations and patterns. Technical documents, literature, and even code snippets each present unique challenges that improve your overall typing ability. Don't limit yourself to one type of content.`
    },
    {
        category: 'articles',
        filename: 'productivity_guide.txt',
        content: `# title: Keyboard Productivity Techniques
# author: Efficiency Expert
# difficulty: Medium
# category: Articles

Mastering keyboard shortcuts can dramatically increase your productivity. Learning the most common shortcuts for your operating system and frequently used applications can save hours of time over weeks and months. Start with basics like copy, paste, and undo, then gradually expand your repertoire.

Text expansion tools allow you to type short abbreviations that automatically expand into longer phrases or paragraphs. This is particularly useful for email signatures, common responses, or frequently typed technical terms. Setting up a good text expansion system can reduce typing by thirty percent or more.

Proper ergonomics prevents repetitive strain injuries that can derail your productivity. Invest in a quality keyboard that suits your typing style. Mechanical keyboards provide tactile feedback that many typists find improves their accuracy and satisfaction. Consider ergonomic layouts if you experience discomfort.

Learn to use keyboard navigation instead of reaching for the mouse. Most applications support extensive keyboard control, from switching between windows to navigating menus. The time saved by keeping your hands on the keyboard adds up significantly throughout the day.

Regular breaks are essential for maintaining peak performance. Follow the twenty-twenty-twenty rule: every twenty minutes, look at something twenty feet away for twenty seconds. This reduces eye strain and gives your hands a brief rest, helping maintain typing speed and accuracy throughout long work sessions.`
    },
    {
        category: 'classics',
        filename: 'typing_wisdom.txt',
        content: `# title: Timeless Typing Wisdom
# author: Anonymous Typist
# difficulty: Easy
# category: Classics

In days of old, when typewriters ruled the office landscape, accuracy was paramount. Each mistake required careful correction with white-out or retyping entire pages. This constraint taught typists the value of deliberate, accurate keystrokes over raw speed.

The QWERTY keyboard layout, designed in the 1870s, was created to prevent mechanical typewriter jams by spacing commonly used letter pairs apart. Though we no longer face this mechanical limitation, the layout persists as a testament to the power of established standards.

Touch typing was developed in the late 1800s by Frank Edward McGurrin, who won a famous typing contest against the hunt-and-peck method. His technique of keeping eyes on the copy rather than the keys revolutionized office work and remains the gold standard today.

The average typing speed for most people is around forty words per minute, while professional typists often exceed seventy. The world record stands at over two hundred words per minute, though such speeds are rarely practical for everyday use. Focus on consistent, comfortable speed rather than racing to extremes.

Remember that typing is a tool for communication and creation. Whether you're writing code, crafting emails, or composing literature, your typing skills serve to translate thoughts into text. The goal is not just speed, but fluency that allows ideas to flow unimpeded from mind to screen.`
    }
];

console.log('Generating sample text files...');
for (const s of samples) {
    const path = join(textsRoot, s.category, s.filename);
    writeFileSync(path, s.content, 'utf-8');
    console.log('SUCCESS: Created texts/' + s.category + '/' + s.filename);
}

const readme = `# Narratype Text Library

This directory contains practice texts organized by category:

- classics/ - Public domain literature and timeless content
- technical/ - Programming and technical documentation
- exercises/ - Structured typing exercises and drills
- articles/ - Educational articles and guides
- custom/ - Your imported texts

Add metadata headers to new files:

# title: Your Text Title
# author: Author Name
# difficulty: Easy|Medium|Hard
# category: Category Name

Your text content starts here...

Files are scanned automatically. Database entries are created only when you practice a text.`;
writeFileSync(join(textsRoot, 'README.md'), readme, 'utf-8');
console.log('SUCCESS: Created texts/README.md');


