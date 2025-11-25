# 📚 Attend75 - Smart Attendance Calculator

A comprehensive attendance management tool that helps students strategically plan their class attendance while considering medical leaves (ML) and duty leaves (DL) to maintain their target attendance percentage.

## 🌟 Features

### Core Functionality
- **Real-time Attendance Tracking**: Calculate current attendance percentage
- **Target-based Planning**: Set and maintain your desired attendance percentage
- **Smart Leave Management**: Handle medical and duty leaves with configurable criteria
- **Strategic Recommendations**: Get actionable insights on when to attend or skip classes

### Advanced Capabilities
- **Safe-to-Bunk Calculator**: Know exactly how many classes you can safely skip
- **Future Projections**: See when your leaves will become available
- **Optimal Strategy Planning**: Get the most efficient path to your target percentage
- **Leave Unlock Predictions**: Know how many classes to attend before leaves apply

## 🧮 Logic & Calculations

### Attendance Calculation Logic

#### Basic Attendance Formula
```
Current Attendance % = (Attended Classes / Total Classes) × 100
```

#### Effective Attendance with Leaves
```
Effective Attendance % = ((Attended Classes + Applied Leaves) / Total Classes) × 100
```

### Leave Application Logic

#### Medical Leaves
- **Criterion-based**: Only applied when current attendance ≥ specified criterion
- **Smart Application**: Can be set to "only required" mode to use leaves efficiently
- **Strategic Timing**: Applied only when needed to reach target percentage

#### Duty Leaves
- **Immediate Application**: Can be set to apply immediately (criterion = 0%)
- **Flexible Criteria**: Can be configured with attendance thresholds
- **Boost Calculation**: Applied outside attended classes to boost percentage

### Safe-to-Bunk Calculation

#### Current Formula (Fixed)
```typescript
const classesToBunk = current > target 
  ? Math.floor((effectiveAttended - target * totalClasses) / target)
  : 0
```

#### Strategic Bunking Logic
1. **Current Safe Bunk**: Based on current attendance without leaves
2. **Safe Bunk with Current Leaves**: Considering currently available leaves
3. **Safe Bunk with All Leaves**: Maximum potential after all leaves unlock

### Future Projections

#### Leave Unlock Calculation
```typescript
const unlockClasses = criterion > 0 
  ? Math.max(0, Math.ceil((criterion / 100) * totalClasses) - attendedClasses)
  : 0
```

#### Optimal Attendance Strategy
```typescript
const classesNeededWithAllLeaves = Math.max(0, 
  Math.ceil(target * totalClasses) - (attendedClasses + totalPotentialLeaves)
)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhishekkapoorx/attend75.git
cd attend75
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💡 How to Use

### Step 1: Enter Basic Information
- **Total Classes**: Total number of classes conducted so far
- **Attended Classes**: Number of classes you have attended
- **Target Percentage**: Your desired attendance percentage (e.g., 75%)

### Step 2: Configure Leave Settings
- **Medical Leaves**: Set number of leaves and application criterion
- **Duty Leaves**: Configure duty leave count and when they apply
- **Only Required Toggle**: Use leaves only when needed to reach target

### Step 3: Get Strategic Insights
- **Current Status**: View raw vs effective attendance
- **Action Plan**: See whether to attend more classes or if you can safely bunk
- **Future Projections**: Understand when leaves will unlock and optimal strategy

## 🎯 Use Cases

### Scenario 1: Below Target
- **Situation**: 60% attendance, need 75%
- **Recommendation**: Shows exact classes to attend
- **Strategy**: Displays when medical leaves will unlock

### Scenario 2: At Risk
- **Situation**: 73% attendance, target 75%
- **Recommendation**: Strategic use of available leaves
- **Strategy**: Optimal path to maintain target

### Scenario 3: Above Target
- **Situation**: 80% attendance, target 75%
- **Recommendation**: Safe bunking calculations
- **Strategy**: Maximum classes that can be skipped

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: Formik with Yup validation
- **Deployment**: Vercel

## 🔧 Key Algorithms

### Enhanced Safe-to-Bunk Algorithm
The application uses a mathematically correct formula that considers:
- Current effective attendance (including applied leaves)
- Target percentage requirements
- Future class projections
- Leave availability and criteria

### Strategic Leave Application
Leaves are applied in optimal order:
1. **Immediate leaves** (criterion = 0%) applied first
2. **Criterion-based leaves** applied when eligible
3. **Only-required leaves** used strategically to minimize waste

### Future Projection Engine
Calculates multiple scenarios:
- Classes needed to unlock each leave type
- Optimal attendance path with all leaves
- Maximum safe bunking potential
- Strategic recommendations based on current status

## 📊 Example Calculations

### Test Case: Strategic Planning
```
Input:
- Total Classes: 100
- Attended: 72
- Target: 75%
- Medical Leaves: 5 (criterion: 70%)
- Duty Leaves: 2 (criterion: 0%)

Output:
- Current: 72% ✅ (above medical criterion)
- Effective: 79% (72 + 5 + 2 = 79)
- Safe to Bunk: 5 classes
- Strategy: All leaves applied, can safely skip classes
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

