import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'

// Default values shown
export const SpinnerT = () => (
  <Hourglass
    size="40"
    bgOpacity="0.1"
    speed="1.75"
    color="white"
  />
);