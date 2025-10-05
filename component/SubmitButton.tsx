'use client'

interface SubmitButtonProps {
  name: string
  disabled?: boolean
}

export default function SubmitButton({ name, disabled = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-2 rounded-md text-white font-semibold transition ${
        disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
      }`}
    >
      {name}
    </button>
  )
}