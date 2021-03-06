import ScratchBlocks from '../scratch-patches/scratch-blocks'

/**
 * Connect scratch blocks with the vm
 * @param {VirtualMachine} vm - The scratch vm
 * @return {ScratchBlocks} ScratchBlocks connected with the vm
 */
export default function (vm) {
  const jsonForMenuBlock = function (name, menuOptionsFn, colors, start) {
    return {
      message0: '%1',
      args0: [
        {
          type: 'field_dropdown',
          name: name,
          options: function () {
            return start.concat(menuOptionsFn())
          },
        },
      ],
      inputsInline: true,
      output: 'String',
      colour: colors.secondary,
      colourSecondary: colors.secondary,
      colourTertiary: colors.tertiary,
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
    }
  }

  const jsonForHatBlockMenu = function (
    hatName,
    name,
    menuOptionsFn,
    colors,
    start
  ) {
    return {
      message0: hatName,
      args0: [
        {
          type: 'field_dropdown',
          name: name,
          options: function () {
            return start.concat(menuOptionsFn())
          },
        },
      ],
      colour: colors.primary,
      colourSecondary: colors.secondary,
      colourTertiary: colors.tertiary,
      extensions: ['shape_hat'],
    }
  }

  const soundsMenu = function () {
    if (vm.editingTarget && vm.editingTarget.sprite.sounds.length > 0) {
      return vm.editingTarget.sprite.sounds.map((sound) => [
        sound.name,
        sound.name,
      ])
    }
    return [['', '']]
  }

  const costumesMenu = function () {
    if (vm.editingTarget && vm.editingTarget.getCostumes().length > 0) {
      return vm.editingTarget
        .getCostumes()
        .map((costume) => [costume.name, costume.name])
    }
    return [['', '']]
  }

  const backdropsMenu = function () {
    if (
      vm.runtime.targets[0] &&
      vm.runtime.targets[0].getCostumes().length > 0
    ) {
      return vm.runtime.targets[0]
        .getCostumes()
        .map((costume) => [costume.name, costume.name])
        .concat([
          ['nächstes', 'next backdrop'],
          ['vorheriges', 'previous backdrop'],
          ['zufälliges', 'random backdrop'],
        ])
    }
    return [['', '']]
  }

  const backdropNamesMenu = function () {
    const stage = vm.runtime.getTargetForStage()
    if (stage && stage.getCostumes().length > 0) {
      return stage.getCostumes().map((costume) => [costume.name, costume.name])
    }
    return [['', '']]
  }

  const spriteMenu = function () {
    const sprites = []
    for (const targetId in vm.runtime.targets) {
      if (!(targetId in vm.runtime.targets)) {
        continue
      }
      if (vm.runtime.targets[targetId].isOriginal) {
        if (!vm.runtime.targets[targetId].isStage) {
          if (vm.runtime.targets[targetId] === vm.editingTarget) {
            continue
          }
          sprites.push([
            vm.runtime.targets[targetId].sprite.name,
            vm.runtime.targets[targetId].sprite.name,
          ])
        }
      }
    }
    return sprites
  }

  const cloneMenu = function () {
    if (vm.editingTarget && vm.editingTarget.isStage) {
      const menu = spriteMenu()
      if (menu.length === 0) {
        return [['', '']] // Empty menu matches Scratch 2 behavior
      }
      return menu
    }
    return [['mir selbst', '_myself_']].concat(spriteMenu())
  }

  const soundColors = ScratchBlocks.Colours.sounds

  const looksColors = ScratchBlocks.Colours.looks

  const motionColors = ScratchBlocks.Colours.motion

  const sensingColors = ScratchBlocks.Colours.sensing

  const controlColors = ScratchBlocks.Colours.control

  const eventColors = ScratchBlocks.Colours.event

  ScratchBlocks.Blocks.sound_sounds_menu.init = function () {
    const json = jsonForMenuBlock('SOUND_MENU', soundsMenu, soundColors, [])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.looks_costume.init = function () {
    const json = jsonForMenuBlock('COSTUME', costumesMenu, looksColors, [])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.looks_backdrops.init = function () {
    const json = jsonForMenuBlock('BACKDROP', backdropsMenu, looksColors, [])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.event_whenbackdropswitchesto.init = function () {
    const json = jsonForHatBlockMenu(
      ScratchBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO,
      'BACKDROP',
      backdropNamesMenu,
      eventColors,
      []
    )
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.motion_pointtowards_menu.init = function () {
    const json = jsonForMenuBlock('TOWARDS', spriteMenu, motionColors, [
      ['Mauszeiger', '_mouse_'],
    ])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.motion_goto_menu.init = function () {
    const json = jsonForMenuBlock('TO', spriteMenu, motionColors, [
      ['Zufallsposition', '_random_'],
      ['Mauszeiger', '_mouse_'],
    ])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.motion_glideto_menu.init = function () {
    const json = jsonForMenuBlock('TO', spriteMenu, motionColors, [
      ['Zufallsposition', '_random_'],
      ['Mauszeiger', '_mouse_'],
    ])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.sensing_of_object_menu.init = function () {
    const json = jsonForMenuBlock('OBJECT', spriteMenu, sensingColors, [
      ['Bühne', '_stage_'],
    ])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.sensing_distancetomenu.init = function () {
    const json = jsonForMenuBlock('DISTANCETOMENU', spriteMenu, sensingColors, [
      ['Mauszeiger', '_mouse_'],
    ])
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.sensing_touchingobjectmenu.init = function () {
    const json = jsonForMenuBlock(
      'TOUCHINGOBJECTMENU',
      spriteMenu,
      sensingColors,
      [
        ['Mauszeiger', '_mouse_'],
        ['Rand', '_edge_'],
      ]
    )
    this.jsonInit(json)
  }

  ScratchBlocks.Blocks.control_create_clone_of_menu.init = function () {
    const json = jsonForMenuBlock('CLONE_OPTION', cloneMenu, controlColors, [])
    this.jsonInit(json)
  }

  ScratchBlocks.VerticalFlyout.getCheckboxState = function (blockId) {
    const monitoredBlock = vm.runtime.monitorBlocks._blocks[blockId]
    return monitoredBlock ? monitoredBlock.isMonitored : false
  }

  ScratchBlocks.ScratchMsgs.setLocale('de')

  /* --- HACK: Fix music blocks --- */
  // Gives music blocks dropdown menus and translations

  ScratchBlocks.jsonInitFactory_ = function (jsonDef) {
    if (jsonDef.type == 'music_playDrumForBeats') {
      jsonDef.args0[2] = {
        type: 'field_dropdown',
        name: 'DRUM',
        options: function () {
          return [
            ['(1) Snare-Drum', '1'],
            ['(2) Bass-Drum', '2'],
            ['(3) Side-Stick', '3'],
            ['(4) Crash-Becken', '4'],
            ['(5) Offene Hi-Hat', '5'],
            ['(6) Geschlossene Hi-Hat', '6'],
            ['(7) Tamburin', '7'],
            ['(8) Klatschen', '8'],
            ['(9) Klangstäbe', '9'],
            ['(10) Holzblock', '10'],
            ['(11) Kuhglocke', '11'],
            ['(12) Triangel', '12'],
            ['(13) Bongo', '13'],
            ['(14) Konga', '14'],
            ['(15) Cabasa', '15'],
            ['(16) Güiro', '16'],
            ['(17) Vibraslap', '17'],
            ['(18) Cuíca', '18'],
          ]
        },
      }
      jsonDef.message0 = '%1 %2spiele Schlaginstrument %3 für %4 Schläge'
    } else if (jsonDef.type == 'music_setInstrument') {
      jsonDef.args0[2] = {
        type: 'field_dropdown',
        name: 'INSTRUMENT',
        options: function () {
          return [
            ['(1) Klavier', '1'],
            ['(2) E-Piano', '2'],
            ['(3) Orgel', '3'],
            ['(4) Gitarre', '4'],
            ['(5) E-Gitarre', '5'],
            ['(6) Bass-Gitarre', '6'],
            ['(7) Pizzicato', '7'],
            ['(8) Cello', '8'],
            ['(9) Posaune', '9'],
            ['(10) Klarinette', '10'],
            ['(11) Saxophon', '11'],
            ['(12) Querflöte', '12'],
            ['(13) Blockflöte', '13'],
            ['(14) Fagott', '14'],
            ['(15) Chor', '15'],
            ['(16) Vibraphon', '16'],
            ['(17) Musikbox', '17'],
            ['(18) Steel-Drum', '18'],
            ['(19) Marimba', '19'],
            ['(20) Lead-Synthesizer', '20'],
            ['(21) Pad-Synthesizer', '21'],
          ]
        },
      }
      jsonDef.message0 = '%1 %2setze Instrument auf %3'
    } else if (jsonDef.type == 'music_restForBeats') {
      jsonDef.message0 = '%1 %2pausiere %3 Schläge'
    } else if (jsonDef.type == 'music_playNoteForBeats') {
      jsonDef.message0 = '%1 %2spiele Ton %3 für %4 Schläge'
    } else if (jsonDef.type == 'music_setTempo') {
      jsonDef.message0 = '%1 %2setze Tempo auf %3'
    } else if (jsonDef.type == 'music_changeTempo') {
      jsonDef.message0 = '%1 %2ändere Tempo um %3'
    } else if (jsonDef.type == 'music_getTempo') {
      jsonDef.message0 = '%1 %2Tempo'
    }
    return function () {
      this.jsonInit(jsonDef)
    }
  }

  // Fix piano flyout not playing notes
  ScratchBlocks.FieldNote.playNote_ = function (noteNum, extensionId) {
    vm.runtime.emit('PLAY_NOTE', noteNum, extensionId)
  }

  return ScratchBlocks
}
