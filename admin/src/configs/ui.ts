import { ref } from 'vue'
import type { placementType } from '@/typings/ui'
import { Placement } from 'naive-ui/es/drawer/src/DrawerBodyWrapper'

// ui
export const placement = ref<placementType | null>(null)
export const drawerPlacement = ref<Placement | undefined>(undefined)
