# UI Components - Notifications

This folder contains the notification system components that replace browser alerts with elegant UI.

## Toast Notifications

Toast notifications appear in the top-right corner and auto-dismiss after 4 seconds.

### Usage

```tsx
import { useToast } from '@/hooks/useToast'

function MyComponent() {
  const { success, error, info, warning } = useToast()

  const handleSave = async () => {
    try {
      // ... save logic
      success('נשמר בהצלחה!')
    } catch (err) {
      error('שגיאה בשמירה')
    }
  }

  return <button onClick={handleSave}>שמור</button>
}
```

### Available Methods

- `success(message, duration?)` - Green toast for success messages
- `error(message, duration?)` - Red toast for error messages  
- `info(message, duration?)` - Blue toast for informational messages
- `warning(message, duration?)` - Yellow toast for warnings

Duration is optional and defaults to 4000ms (4 seconds).

## Dialog Components

### Basic Dialog

Use for custom modal content:

```tsx
import { Dialog } from '@/components/ui/dialog'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>
      
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="כותרת"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleConfirm}>אישור</Button>
          </>
        }
      >
        <p>תוכן המודאל</p>
      </Dialog>
    </>
  )
}
```

### Confirm Dialog

Use for confirmation prompts:

```tsx
import { ConfirmDialog } from '@/components/ui/dialog'

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    // deletion logic
  }

  return (
    <>
      <button onClick={() => setShowConfirm(true)}>מחק</button>
      
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="מחק פריט"
        message="האם אתה בטוח?"
        confirmText="מחק"
        cancelText="ביטול"
        variant="danger" // or "default"
      />
    </>
  )
}
```

## Migration from `alert()` and `confirm()`

### Before

```tsx
if (!formData.name) {
  alert('שם הוא שדה חובה')
  return
}

if (confirm('האם אתה בטוח?')) {
  // do something
}
```

### After

```tsx
const { error } = useToast()
const [showConfirm, setShowConfirm] = useState(false)

// Validation
if (!formData.name) {
  error('שם הוא שדה חובה')
  return
}

// Confirmation
<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleAction}
  title="אישור"
  message="האם אתה בטוח?"
/>
``` 