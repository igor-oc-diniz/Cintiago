export interface PizzaCardProps {
  id: number
  name: string
  description: string
  imageUrl: string | null
  startingPrice: number
  isVegetarian: boolean
  isNew: boolean
  onClick: () => void
  className?: string
}
