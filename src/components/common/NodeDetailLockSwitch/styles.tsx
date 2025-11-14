import styled from 'styled-components'
import { Switch } from '@aleph-front/core'

export const StyledSwitch = styled(Switch)`
  & span {
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNyAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC4zIj4KPHBhdGggZD0iTTEwLjA4MyA0LjY4NzVWNkgxMi43MDhWMTQuNzVIMC40NTgwMDhWNkg4LjMzMzAxVjQuNjg3NUM4LjMzMzAxIDIuNTI3MzQgMTAuMDgzIDAuNzUgMTIuMjcwNSAwLjc1QzE0LjQzMDcgMC43NSAxNi4yMDggMi41MjczNCAxNi4yMDggNC42ODc1VjZWNi44NzVIMTQuNDU4VjZWNC42ODc1QzE0LjQ1OCAzLjQ4NDM4IDEzLjQ3MzYgMi41IDEyLjI3MDUgMi41QzExLjA0IDIuNSAxMC4wODMgMy40ODQzOCAxMC4wODMgNC42ODc1WiIgZmlsbD0iIzE0MTMyNyIvPgo8L2c+Cjwvc3ZnPgo=');
    background-repeat: no-repeat;
    background-position: 50%;

    &::after {
      background-image:
        url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNSAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC41Ij4KPHBhdGggZD0iTTUuNDc4NTIgNC42ODc1VjZIOS44NTM1MlY0LjY4NzVDOS44NTM1MiAzLjQ4NDM4IDguODY5MTQgMi41IDcuNjY2MDIgMi41QzYuNDM1NTUgMi41IDUuNDc4NTIgMy40ODQzOCA1LjQ3ODUyIDQuNjg3NVpNMy43Mjg1MiA2VjQuNjg3NUMzLjcyODUyIDIuNTI3MzQgNS40Nzg1MiAwLjc1IDcuNjY2MDIgMC43NUM5LjgyNjE3IDAuNzUgMTEuNjAzNSAyLjUyNzM0IDExLjYwMzUgNC42ODc1VjZIMTMuNzkxVjE0Ljc1SDEuNTQxMDJWNkgzLjcyODUyWiIgZmlsbD0iIzE0MTMyNyIvPgo8L2c+Cjwvc3ZnPgo='),
        linear-gradient(90deg, #00d1ff 0%, #0054ff 100%);
      background-repeat: no-repeat;
      background-position: 50%;
    }
  }
`
