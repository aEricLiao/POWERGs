import { useState, MouseEvent } from 'react'
import useStyles from './style'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'

interface MenuAnchorPosition {
  mouseX: number | null
  mouseY: number | null
}

const LeftDrawer = () => {
  const classes = useStyles()
  const [state, setState] = useState<MenuAnchorPosition>({
    mouseX: null,
    mouseY: null,
  })
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const onContextMenu = (event: MouseEvent, nodeId: string | null) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedNodeId(nodeId)
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    })
  }

  const handleClose = () => {
    setState({ mouseX: null, mouseY: null })
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}>
      <Toolbar />
      <Box p={2}>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}>
          <TreeItem
            nodeId="1"
            label="Applications"
            onContextMenu={(event) => onContextMenu(event, 'Applications')}>
            <TreeItem
              nodeId="4"
              label="Webstorm"
              onContextMenu={(event) => onContextMenu(event, 'Webstorm')}>
              <TreeItem
                nodeId="7"
                label="src"
                onContextMenu={(event) => onContextMenu(event, 'src')}>
                <TreeItem
                  nodeId="9"
                  label="tree-view.js"
                  onContextMenu={(event) =>
                    onContextMenu(event, 'tree-view.js')
                  }
                />
              </TreeItem>
            </TreeItem>
          </TreeItem>
        </TreeView>
      </Box>
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY && state.mouseX
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }>
        <MenuItem onClick={handleClose}>{selectedNodeId}</MenuItem>
      </Menu>
    </Drawer>
  )
}

export default LeftDrawer
