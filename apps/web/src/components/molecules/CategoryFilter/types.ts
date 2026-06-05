export interface CategoryFilterProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
  className?: string
}
