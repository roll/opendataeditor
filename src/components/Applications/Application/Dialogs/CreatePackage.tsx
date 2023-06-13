import * as React from 'react'
import SourceIcon from '@mui/icons-material/Source'
import InputDialog from '../../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'
import * as settings from '../../../../settings'

export default function CreatePackageDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createPackage = useStore((state) => state.createPackage)
  const updateState = useStore((state) => state.updateState)
  const path = [folderPath, settings.PACKAGE_PATH].filter((v) => v).join('/')
  return (
    <InputDialog
      open={true}
      value={path}
      title="Create Package"
      label="Create"
      description="You are creating a package. Enter destination:"
      placholder="Enter a package path"
      Icon={SourceIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createPackage(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
