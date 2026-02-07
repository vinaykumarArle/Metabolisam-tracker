# REBASE - Visual Design Guide

## 🎨 User Interface Overview

```
┌─────────────────────────────────────┐
│  REBASE  ▼ (Header/Sticky)          │
│  Metabolic Journal                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Month & Year (Feb 2026)             │
│ ◄ M T W T F S S ►                   │
│    └─ Selected Day (Blue)           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│  Morning Weight                     │
│  103  kg                            │ ← Large input
│  ▔▔▔▔▔▔▔▔▔                         │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ✓ Complete Day                     │
│  (or day summary if complete)       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Journal Entries                    │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ 07:30                          │ │ ← Timestamp
│  │ 3 Eggs, Coffee, 2 Toast      │ │ ← Entry text
│  │            ✎ 🗑                │ │ ← Edit/Delete
│  └────────────────────────────────┘ │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ 12:45                          │ │
│  │ Chicken Salad with Olive Oil   │ │
│  │            ✎ 🗑                │ │
│  └────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘

                    ⊕  ← Floating Action Button
```

## 📱 Component Breakdown

### 1. Header
```
┌────────────────────────────┐
│  ▼ REBASE                  │
│  Metabolic Journal         │
│  (sticky/fixed at top)     │
└────────────────────────────┘
- Position: sticky top-0
- Background: slate-900
- Border: bottom border-slate-800
- Icons: TrendingDown (blue)
- Text: Large, centered
```

### 2. Calendar Strip
```
┌───────────────────────────────────────┐
│  February 2026                        │
│  ◄ ⭕ ⭕ 🔵 ⭕ ⭕ ⭕ ⭕ ►              │
│    M  T  W  T  F  S  S               │
│  15 16 17 18 19 20 21                │
└───────────────────────────────────────┘
- Selected: bg-blue-600 (bright)
- Unselected: bg-slate-800
- Buttons: w-12 h-12 (sm: w-14 h-14)
- Border: rounded-full
- Gap: 1.5 or 2
```

### 3. Weight Input
```
┌─────────────────────┐
│ Morning Weight      │ ← Label (uppercase, gray)
│ 103.5 kg           │ ← Large number + unit
│ ═════════════      │ ← Blue underline
└─────────────────────┘
- Input: text-4xl sm:text-5xl font-bold
- Placeholder: slate-700
- Border: border-b-2 border-blue-600
- No rounded corners, clean look
```

### 4. Complete Day Button
```
┌─────────────────────────────┐
│ ✓ Complete Day             │  ← Normal state
│                             │
│ ⟳ Processing...            │  ← Loading state
│                             │
│ ✓ Day Complete             │  ← After completion
│ ✓ Weight Logged            │
│ ✓ 4 meals tracked          │
└─────────────────────────────┘
- Color: bg-gradient-to-r from-blue-600 to-blue-700
- Hover: darker gradient
- Loading: spinner animation
- Width: full
- Padding: py-3 px-4
```

### 5. Entry Cards
```
┌────────────────────────────────┐
│ 07:30                          │ ← Time (gray)
│ 3 Eggs, Coffee, 2 Toast       │ ← Content
│            ✎ 🗑                │ ← Actions
│ (hover: edit pencil highlights)│
└────────────────────────────────┘
- Background: bg-slate-900
- Border: border-slate-800
- Padding: p-3 sm:p-4
- Rounded: rounded-xl (12px)
- Hover: border-slate-700
- Edit mode: textarea appears
```

### 6. Entry Modal
```
┌─────────────────────────────────────┐
│ Log Meal/Note              ✕         │ ← Header
├─────────────────────────────────────┤
│                                     │
│ Meal/Note                           │ ← Label
│ ┌─────────────────────────────────┐ │
│ │ 3 Eggs, Coffee, Chicken Salad   │ │ ← Textarea
│ │                                  │ │
│ │                                  │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ Cancel          Save ✓               │ ← Actions
└─────────────────────────────────────┘
- Backdrop: fixed inset-0 bg-black/30 backdrop-blur-sm
- Modal: max-w-md bg-slate-900 rounded-2xl
- Smooth animation: slide-in-from-bottom-4
- Z-index: z-50
```

### 7. Floating Action Button
```
         ⊕
    ┌────────┐
    │ bottom │ = 24px (6 units)
    │ right  │ = 24px
    └────────┘
- Size: w-14 h-14 (sm: w-16 h-16)
- Color: bg-blue-600 hover:bg-blue-700
- Shadow: shadow-lg hover:shadow-xl
- Rounded: rounded-full
- Icon: Plus (w-6 h-6)
- Active: scale-95 on click
- Z-index: z-30
- Position: fixed bottom-6 right-6
```

## 🎨 Color Palette

### Primary Colors
```
┌──────────────────────────────────────┐
│ Background (Page)                    │ #0F172A (slate-950)
│ Cards/Content Area                   │ #1E293B (slate-900)
│ Primary Action (Buttons)             │ #3B82F6 (blue-600)
│ Primary Hover                        │ #1E40AF (blue-700)
│ Secondary Color                      │ #60A5FA (blue-400)
└──────────────────────────────────────┘
```

### Text Colors
```
┌──────────────────────────────────────┐
│ Primary Text                         │ #F1F5F9 (slate-50)
│ Secondary Text                       │ #CBD5E1 (slate-300)
│ Tertiary Text (hints)                │ #94A3B8 (slate-400)
│ Disabled Text                        │ #64748B (slate-500)
└──────────────────────────────────────┘
```

### Accent Colors
```
┌──────────────────────────────────────┐
│ Success                              │ #22C55E (green-500)
│ Warning                              │ #EAB308 (yellow-500)
│ Error                                │ #EF4444 (red-500)
│ Border                               │ #334155 (slate-800)
└──────────────────────────────────────┘
```

## 📐 Typography Scale

```
Display (Hero)          48-60px font-bold
Title (H1)              32-40px font-bold
Heading (H2)            24-32px font-semibold
Subheading (H3)         18-20px font-semibold
Large (Body)            16-18px font-medium
Regular (Body)          14-16px font-normal
Small (Meta)            12-14px font-normal
Tiny (Label)            10-12px font-medium uppercase
```

### Specific Usage
```
Weight Display          5xl font-bold (103.5 kg)
Month/Year Title        lg-xl font-semibold
Day Buttons             text-sm font-medium
Entry Cards             text-sm text-slate-200
Timestamps              text-xs text-slate-400
Labels                  text-xs font-medium uppercase
Modal Headers           text-lg font-semibold
```

## 📏 Spacing System

```
2xs:  2px  (for borders)
xs:   4px  (small gaps)
sm:   8px  (gap-1, small padding)
base: 12px (gap-3, comfortable padding)
lg:   16px (gap-4, card padding)
xl:   24px (gap-6, section padding)
2xl:  32px (gap-8, major sections)
```

### Common Usage
```
Card Padding:        p-3 sm:p-4 (12-16px)
Header Padding:      px-4 py-4 (both sides)
Button Padding:      py-2.5 px-4 (10-16px)
Modal Padding:       p-4 sm:p-6 (16-24px)
Entry Gaps:          gap-2 or gap-3 (8-12px)
Section Padding:     px-4 sm:px-6 (16-24px)
```

## 🔴 Border & Radius

```
Borders:
- Cards:              border border-slate-800
- Inputs:            border border-slate-700 (focus: border-blue-500)
- Dividers:          border-t border-slate-800

Rounded Corners:
- Standard (cards):   rounded-xl (12px)
- Large (modal):      rounded-2xl (16px)
- Buttons:           rounded-lg or rounded-xl
- Buttons (circle):  rounded-full
- Inputs:            rounded-xl
```

## ✨ Effects & Animations

### Shadows
```
Card Hover:          shadow-md
Modal:               shadow-2xl
FAB:                 shadow-lg hover:shadow-xl
```

### Transitions
```
Interactive Elements: transition-all duration-200 ease-in-out
Buttons (active):    active:scale-95 (tap feedback)
Modal Backdrop:      opacity-0 to opacity-100
Modal Content:       translateY(100%) to translateY(0%)
Loading Spinner:     animate-spin
Hover Effects:       hover:bg-slate-800 hover:border-slate-700
```

### Animations
```
Day Completion:      Spinner for 1.2 seconds
Modal Slide:         slideUp 0.3s ease-out
Loading Pulse:       animate-pulse (subtle)
```

## 📱 Responsive Design

### Mobile-First Breakpoints
```
Base (Mobile)        320px - 767px
  - Full width
  - Bottom sheet modals
  - Larger touch targets
  - Vertical layout

Small (sm:)          640px - 1023px
  - More padding
  - Optimized spacing
  - Same layout

Medium (md:)         768px - 1279px
  - Tablet layout
  - Centered content
  - Increased gaps

Large (lg:)          1280px+
  - Desktop layout
  - Max-width container
  - Professional spacing
```

### Responsive Classes Used
```
Text:                text-lg sm:text-xl (14px → 20px)
Padding:             px-4 sm:px-6 (16px → 24px)
Size:                w-12 h-12 sm:w-14 sm:h-14 (48px → 56px)
Gaps:                gap-1.5 sm:gap-2 (6px → 8px)
Buttons:             p-2 sm:p-3 (8px → 12px)
```

## 🌙 Dark Mode

All components use:
```
Background:    bg-slate-950 (never white)
Cards:         bg-slate-900 (never gray)
Text:          text-slate-50 (never pure black)
Borders:       border-slate-800 (not too light)
Hover:         hover:bg-slate-800 (slightly lighter)
Focus:         focus:border-blue-500 (bright accent)
```

## ♿ Accessibility

### Color Contrast
```
✓ Text on background:    4.5:1 ratio (WCAG AA)
✓ Buttons:              3:1 ratio minimum
✓ Focus states:         Blue border (obvious)
✓ Icons:                Never color-only (always with text)
```

### Touch Targets
```
✓ Buttons:   44px × 44px minimum (iOS)
✓ Input:     44px height
✓ Calendar:  12-14 units (48-56px)
✓ FAB:       14-16 units (56-64px)
```

### Focus & Navigation
```
✓ Tab order:         Left to right, top to bottom
✓ Focus visible:     2px border or outline
✓ Labels:            All inputs labeled
✓ Skip links:        Ready (can be added)
```

## 📊 Layout Examples

### Mobile View (375px)
```
┌─────────────┐
│   HEADER    │
├─────────────┤
│  CALENDAR   │
├─────────────┤
│ WEIGHT INP  │
├─────────────┤
│  COMPLETE   │
├─────────────┤
│  ENTRIES    │
│  Entry 1    │
│  Entry 2    │
│  Entry 3    │
│  (scroll)   │
├─────────────┤
│        ⊕    │ ← FAB at bottom right
└─────────────┘
```

### Tablet View (768px)
```
┌────────────────────────────┐
│         HEADER             │
├────────────────────────────┤
│        CALENDAR            │
├────────────────────────────┤
│      WEIGHT INPUT          │
├────────────────────────────┤
│      COMPLETE DAY          │
├────────────────────────────┤
│     ENTRIES (wider)        │
│  Entry 1          Entry 2  │
│  Entry 3          Entry 4  │
│       (scroll)             │
├────────────────────────────┤
│                       ⊕    │
└────────────────────────────┘
```

### Desktop View (1440px)
```
┌──────────────────────────────────────────┐
│              HEADER                      │
├──────────────────────────────────────────┤
│                CALENDAR                  │
├──────────────────────────────────────────┤
│              WEIGHT INPUT                │
├──────────────────────────────────────────┤
│              COMPLETE DAY                │
├──────────────────────────────────────────┤
│            ENTRIES (max-width)           │
│  Entry 1                                 │
│  Entry 2                                 │
│  Entry 3                                 │
│  Entry 4 (scroll area)                   │
├──────────────────────────────────────────┤
│                                       ⊕  │
└──────────────────────────────────────────┘
```

## 🎯 Key Design Principles

1. **Minimal** - Only essential UI elements
2. **Dark-First** - Optimized for dark mode
3. **Touch-Optimized** - Large, easy targets
4. **Responsive** - Works on all screen sizes
5. **Consistent** - Same style throughout
6. **Accessible** - WCAG AA compliant
7. **Performant** - Fast and smooth
8. **Clean** - Professional, modern look

---

**Last Updated**: February 7, 2026  
**Design System Version**: 1.0.0  
**Browser Support**: All modern browsers
