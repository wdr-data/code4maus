const categorySeparator = '<sep gap="36"/>';

const blockSeparator = '<sep gap="36"/>'; // At default scale, about 28px

const prepareBlocks = (defaultBlocks, blockLibFn, wrappedFunction) => (isStage, targetId, blocks = null) => {
    if (Array.isArray(blocks) && blocks.length === 0) {
        return '';
    }

    if (!Array.isArray(blocks)) {
        blocks = defaultBlocks;
    }

    const blockLib = blockLibFn(isStage, targetId);
    const blockXml = blocks.map((type) => {
        if (type === '--') {
            return blockSeparator;
        }
        if (!(type in blockLib)) {
            return '';
        }
        return blockLib[type];
    }).concat(categorySeparator).join();

    return wrappedFunction(
        isStage,
        blockXml,
    );
};

const motionBlockLib = (isStage, targetId) => ({
    movesteps: `
        <block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    `,
    turnright: `
        <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
    `,
    turnleft: `
        <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
    `,
    goto: `
        <block type="motion_goto">
            <value name="TO">
                <shadow type="motion_goto_menu">
                </shadow>
            </value>
        </block>
    `,
    gotoxy: `
        <block type="motion_gotoxy">
            <value name="X">
                <shadow id="movex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="movey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
    `,
    glideto: `
        <block type="motion_glideto" id="motion_glideto">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="motion_glideto_menu">
                </shadow>
            </value>
        </block>
    `,
    glidesecstoxy: `
        <block type="motion_glidesecstoxy">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="X">
                <shadow id="glidex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="glidey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
    `,
    pointindirection: `
        <block type="motion_pointindirection">
            <value name="DIRECTION">
                <shadow type="math_angle">
                    <field name="NUM">90</field>
                </shadow>
            </value>
        </block>
    `,
    pointtowards: `
        <block type="motion_pointtowards">
            <value name="TOWARDS">
                <shadow type="motion_pointtowards_menu">
                </shadow>
            </value>
        </block>
    `,
    changexby: `
        <block type="motion_changexby">
            <value name="DX">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    `,
    setx: `
        <block type="motion_setx">
            <value name="X">
                <shadow id="setx" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
    `,
    changeyby: `
        <block type="motion_changeyby">
            <value name="DY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    `,
    sety: `
        <block type="motion_sety">
            <value name="Y">
                <shadow id="sety" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
    `,
    ifonedgebounce: `
        <block type="motion_ifonedgebounce"/>
    `,
    setrotationstyle: `
        <block type="motion_setrotationstyle"/>
    `,
    xposition: `
        <block id="${targetId}_xposition" type="motion_xposition"/>
    `,
    yposition: `
        <block id="${targetId}_yposition" type="motion_yposition"/>
    `,
    direction: `
        <block id="${targetId}_direction" type="motion_direction"/>
    `,
});

const motionDefaultBlocks = [
    'movesteps',
    'turnright',
    'turnleft',
    '--',
    'goto',
    'gotoxy',
    'glideto',
    'glidesecstoxy',
    '--',
    'pointindirection',
    'pointtowards',
    '--',
    'changexby',
    'setx',
    'changeyby',
    'sety',
    '--',
    'ifonedgebounce',
    '--',
    'setrotationstyle',
    '--',
    'xposition',
    'yposition',
    'direction',
];

const motion = prepareBlocks(motionDefaultBlocks, motionBlockLib, (isStage, blockXml) => {
    const xmlBase = (inner) => `
        <category name="Bewegung" id="motion" iconURI="/static/icons/icon_bewegung.svg">
            ${inner}
        </category>
    `;

    if (isStage) {
        return xmlBase('<label text="Die Bühne kann sich nicht bewegen."></label>');
    }

    return xmlBase(blockXml);
});

const looksBlockLib = (isStage, targetId) => {
    const sayBlocks = isStage ? {} : {
        sayforsecs: `
            <block type="looks_sayforsecs">
                <value name="MESSAGE">
                    <shadow type="text">
                        <field name="TEXT">Hallo!</field>
                    </shadow>
                </value>
                <value name="SECS">
                    <shadow type="math_number">
                        <field name="NUM">2</field>
                    </shadow>
                </value>
            </block>
        `,
        say: `
            <block type="looks_say">
                <value name="MESSAGE">
                    <shadow type="text">
                        <field name="TEXT">Hallo!</field>
                    </shadow>
                </value>
            </block>
        `,
        thinkforsecs: `
            <block type="looks_thinkforsecs">
                <value name="MESSAGE">
                    <shadow type="text">
                        <field name="TEXT">Hmm...</field>
                    </shadow>
                </value>
                <value name="SECS">
                    <shadow type="math_number">
                        <field name="NUM">2</field>
                    </shadow>
                </value>
            </block>
        `,
        think: `
            <block type="looks_think">
                <value name="MESSAGE">
                    <shadow type="text">
                        <field name="TEXT">Hmm...</field>
                    </shadow>
                </value>
            </block>
        `,
    };

    const lookSwitchingBlocks = isStage
        ? {
            switchbackdropto: `
                <block type="looks_switchbackdropto">
                    <value name="BACKDROP">
                        <shadow type="looks_backdrops"/>
                    </value>
                </block>
            `,
            switchbackdroptoandwait: `
                <block type="looks_switchbackdroptoandwait">
                    <value name="BACKDROP">
                        <shadow type="looks_backdrops"/>
                    </value>
                </block>
            `,
            nextbackdrop: `
                <block type="looks_nextbackdrop"/>
            `,
        }
        : {
            switchcostumeto: `
                <block id="${targetId}_switchcostumeto" type="looks_switchcostumeto">
                    <value name="COSTUME">
                        <shadow type="looks_costume"/>
                    </value>
                </block>
            `,
            nextcostume: `
                <block type="looks_nextcostume"/>
            `,
            switchbackdropto: `
                <block type="looks_switchbackdropto">
                    <value name="BACKDROP">
                        <shadow type="looks_backdrops"/>
                    </value>
                </block>
            `,
            nextbackdrop: `
                <block type="looks_nextbackdrop"/>
            `,
            changesizeby: `
                <block type="looks_changesizeby">
                    <value name="CHANGE">
                        <shadow type="math_number">
                            <field name="NUM">10</field>
                        </shadow>
                    </value>
                </block>
            `,
            setsizeto: `
                <block type="looks_setsizeto">
                    <value name="SIZE">
                        <shadow type="math_number">
                            <field name="NUM">100</field>
                        </shadow>
                    </value>
                </block>
            `,
        };

    const effectsBlocks = {
        changeeffectby: `
            <block type="looks_changeeffectby">
                <value name="CHANGE">
                    <shadow type="math_number">
                        <field name="NUM">25</field>
                    </shadow>
                </value>
            </block>
        `,
        seteffectto: `
            <block type="looks_seteffectto">
                <value name="VALUE">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
            </block>
        `,
        cleargraphiceffects: `
            <block type="looks_cleargraphiceffects"/>
        `,
    };

    const visibilityBlocks = isStage ? {} : {
        show: `
            <block type="looks_show"/>
        `,
        hide: `
            <block type="looks_hide"/>
            ${blockSeparator}
        `,
        gotofrontback: `
            <block type="looks_gotofrontback"/>
        `,
        goforwardbackwardlayers: `
            <block type="looks_goforwardbackwardlayers">
                <value name="NUM">
                    <shadow type="math_integer">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
            </block>
        `,
    };

    const varsBlocks = isStage
        ? {
            backdropnumbername: `
                <block id="backdropnumbername" type="looks_backdropnumbername"/>
            `,
        }
        : {
            costumenumbername: `
            <block id="${targetId}_costumenumbername" type="looks_costumenumbername"/>
            `,
            backdropnumbername: `
                <block id="backdropnumbername" type="looks_backdropnumbername"/>
            `,
            size: `
                <block id="${targetId}_size" type="looks_size"/>
            `,
        };

    return {
        ...sayBlocks,
        ...lookSwitchingBlocks,
        ...effectsBlocks,
        ...visibilityBlocks,
        ...varsBlocks,
    };
};

const looksDefaultBlocks = [
    'sayforsecs',
    'say',
    'thinkforsecs',
    'think',
    '--',
    'switchcostumeto',
    'nextcostume',
    'switchbackdropto',
    'switchbackdroptoandwait',
    'nextbackdrop',
    '--',
    'changesizeby',
    'setsizeto',
    '--',
    'changeeffectby',
    'seteffectto',
    'cleargraphiceffects',
    '--',
    'show',
    'hide',
    '--',
    'gotofrontback',
    'goforwardbackwardlayers',
    'costumenumbername',
    'backdropnumbername',
    'size',
];

const looks = prepareBlocks(looksDefaultBlocks, looksBlockLib, (isStage, blockXml) => `
    <category name="Aussehen" id="looks" iconURI="/static/icons/icon_aussehen.svg">
        ${blockXml}
    </category>
`);

const soundBlockLib = (isStage, targetId) => ({
    play: `
        <block id="${targetId}_sound_play" type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"/>
            </value>
        </block>
    `,
    playuntildone: `
        <block id="${targetId}_sound_playuntildone" type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"/>
            </value>
        </block>
    `,
    stopallsounds: `
        <block type="sound_stopallsounds"/>
        ${blockSeparator}
    `,
    changeeffectby: `
        <block type="sound_changeeffectby">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    `,
    seteffectto: `
        <block type="sound_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
    `,
    cleareffects: `
        <block type="sound_cleareffects"/>
        ${blockSeparator}
    `,
    changevolumeby: `
        <block type="sound_changevolumeby">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">-10</field>
                </shadow>
            </value>
        </block>
    `,
    setvolumeto: `
        <block type="sound_setvolumeto">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
    `,
    volume: `
        <block id="volume" type="sound_volume"/>
    `,
});

const soundDefaultBlocks = [
    'play',
    'playuntildone',
    'stopallsounds',
    '--',
    'changeeffectby',
    'seteffectto',
    'cleareffects',
    '--',
    'changevolumeby',
    'setvolumeto',
    'volume',
];

const sound = prepareBlocks(soundDefaultBlocks, soundBlockLib, (isStage, blockXml) => `
    <category name="Klang" id="sound" iconURI="/static/icons/icon_klang.svg">
        ${blockXml}
    </category>
`);

const eventsBlockLib = (isStage, targetId) => ({
    whenflagclicked: `
        <block type="event_whenflagclicked"/>
    `,
    whenkeypressed: `
        <block type="event_whenkeypressed"/>
    `,
    whenstageclicked: !isStage ? '' : `
        <block type="event_whenstageclicked"/>
    `,
    whenthisspriteclicked: isStage ? '' : `
        <block type="event_whenthisspriteclicked"/>
    `,
    whenbackdropswitchesto: `
        <block type="event_whenbackdropswitchesto"/>
    `,
    whengreaterthan: `
        <block type="event_whengreaterthan">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    `,
    whenbroadcastreceived: `
        <block type="event_whenbroadcastreceived"/>
    `,
    broadcast: `
        <block type="event_broadcast">
            <value name="BROADCAST_INPUT">
                <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
    `,
    broadcastandwait: `
        <block type="event_broadcastandwait">
            <value name="BROADCAST_INPUT">
                <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
    `,
});

const eventDefaultBlocks = [
    'whenflagclicked',
    'whenkeypressed',
    'whenstageclicked',
    'whenthisspriteclicked',
    'whenbackdropswitchesto',
    '--',
    'whengreaterthan',
    '--',
    'whenbroadcastreceived',
    'broadcast',
    'broadcastandwait',
];

const events = prepareBlocks(eventDefaultBlocks, eventsBlockLib, (isStage, blockXml) => `
    <category name="Ereignisse" id="events" iconURI="/static/icons/icon_ereignisse.svg">
        ${blockXml}
    </category>
`);

const controlBlockLib = (isStage, targetId) => ({
    wait: `
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
    `,
    repeat: `
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    `,
    forever: `
        <block id="forever" type="control_forever"/>
    `,
    if: `
        <block type="control_if"/>
    `,
    if_else: `
        <block type="control_if_else"/>
    `,
    wait_until: `
        <block id="wait_until" type="control_wait_until"/>
    `,
    repeat_until: `
        <block id="repeat_until" type="control_repeat_until"/>
    `,
    stop: `
        <block id="stop" type="control_stop"/>
    `,
    start_as_clone: isStage ? '' : `
        <block type="control_start_as_clone"/>
    `,
    create_clone_of: `
        <block type="control_create_clone_of">
            <value name="CLONE_OPTION">
                <shadow type="control_create_clone_of_menu"/>
            </value>
        </block>
    `,
    delete_this_clone: isStage ? '' : `
        <block type="control_delete_this_clone"/>
    `,
});

const controlDefaultBlocks = [
    'wait',
    '--',
    'repeat',
    'forever',
    '--',
    'if',
    'if_else',
    'wait_until',
    'repeat_until',
    '--',
    'stop',
    '--',
    'start_as_clone',
    'create_clone_of',
    'delete_this_clone',
];

const control = prepareBlocks(controlDefaultBlocks, controlBlockLib, (isStage, blockXml) => `
    <category name="Steuerung" id="control" iconURI="/static/icons/icon_steuerung.svg">
        ${blockXml}
    </category>
`);

const sensingBlockLib = (isStage, targetId) => {
    const touchBlocks = isStage ? {} : {
        touchingobject: `
            <block type="sensing_touchingobject">
                <value name="TOUCHINGOBJECTMENU">
                    <shadow type="sensing_touchingobjectmenu"/>
                </value>
            </block>
        `,
        touchingcolor: `
            <block type="sensing_touchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
            </block>
        `,
        coloristouchingcolor: `
            <block type="sensing_coloristouchingcolor">
                <value name="COLOR">
                    <shadow type="colour_picker"/>
                </value>
                <value name="COLOR2">
                    <shadow type="colour_picker"/>
                </value>
            </block>
        `,
        distanceto: `
            <block type="sensing_distanceto">
                <value name="DISTANCETOMENU">
                    <shadow type="sensing_distancetomenu"/>
                </value>
            </block>
        `,
    };

    const otherBlocks = {
        askandwait: `
            <block id="askandwait" type="sensing_askandwait">
                <value name="QUESTION">
                    <shadow type="text">
                        <field name="TEXT">Wie heißt du?</field>
                    </shadow>
                </value>
            </block>
        `,
        answer: `
            <block id="answer" type="sensing_answer"/>
        `,
        keypressed: `
            <block type="sensing_keypressed">
                <value name="KEY_OPTION">
                    <shadow type="sensing_keyoptions"/>
                </value>
            </block>
        `,
        mousedown: `
            <block type="sensing_mousedown"/>
        `,
        mousex: `
            <block type="sensing_mousex"/>
        `,
        mousey: `
            <block type="sensing_mousey"/>
        `,
        setdragmode: isStage ? '' : `
            ${blockSeparator}
            <block type="sensing_setdragmode" id="sensing_setdragmode"/>
            ${blockSeparator}
        `,
        loudness: `
            <block id="loudness" type="sensing_loudness"/>
        `,
        timer: `
            <block id="timer" type="sensing_timer"/>
        `,
        resettimer: `
            <block type="sensing_resettimer"/>
        `,
        of: `
            <block id="of" type="sensing_of">
                <value name="OBJECT">
                    <shadow id="sensing_of_object_menu" type="sensing_of_object_menu"/>
                </value>
            </block>
        `,
        current: `
            <block id="current" type="sensing_current"/>
            <block type="sensing_dayssince2000"/>
        `,
        username: `
            <block type="sensing_username"/>
        `,
    };

    return {
        ...touchBlocks,
        ...otherBlocks,
    };
};

const sensingDefaultBlocks = [
    'touchingobject',
    'touchingcolor',
    'coloristouchingcolor',
    'distanceto',
    '--',
    'askandwait',
    'answer',
    '--',
    'keypressed',
    'mousedown',
    'mousex',
    'mousey',
    'setdragmode',
    'loudness',
    '--',
    'timer',
    'resettimer',
    '--',
    'of',
    '--',
    'current',
    '--',
    'dayssince2000',
    'username',
];

const sensing = prepareBlocks(sensingDefaultBlocks, sensingBlockLib, (isStage, blockXml) => `
    <category name="Fühlen" id="sensing" iconURI="/static/icons/icon_fuehlen.svg">
        ${blockXml}
    </category>
`);

const operatorsBlockLib = () => ({
    add: `
        <block type="operator_add">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
    `,
    subtract: `
        <block type="operator_subtract">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
    `,
    multiply: `
        <block type="operator_multiply">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
    `,
    divide: `
        <block type="operator_divide">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
    `,
    random: `
        <block type="operator_random">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    `,
    gt: `
        <block type="operator_gt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">100</field>
                </shadow>
            </value>
        </block>
    `,
    lt: `
        <block type="operator_lt">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">100</field>
                </shadow>
            </value>
        </block>
    `,
    equals: `
        <block type="operator_equals">
            <value name="OPERAND1">
                <shadow type="text">
                    <field name="TEXT"/>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text">
                    <field name="TEXT">100</field>
                </shadow>
            </value>
        </block>
    `,
    and: `
        <block type="operator_and"/>
    `,
    or: `
        <block type="operator_or"/>
    `,
    not: `
        <block type="operator_not"/>
    `,
    join: `
        <block type="operator_join">
            <value name="STRING1">
                <shadow type="text">
                    <field name="TEXT">Apfel</field>
                </shadow>
            </value>
            <value name="STRING2">
                <shadow type="text">
                    <field name="TEXT">Banane</field>
                </shadow>
            </value>
        </block>
    `,
    letter_of: `
        <block type="operator_letter_of">
            <value name="LETTER">
                <shadow type="math_whole_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="STRING">
                <shadow type="text">
                    <field name="TEXT">Apfel</field>
                </shadow>
            </value>
        </block>
    `,
    length: `
        <block type="operator_length">
            <value name="STRING">
                <shadow type="text">
                    <field name="TEXT">Apfel</field>
                </shadow>
            </value>
        </block>
    `,
    contains: `
        <block type="operator_contains" id="operator_contains">
            <value name="STRING1">
                <shadow type="text">
                <field name="TEXT">Apfel</field>
                </shadow>
            </value>
            <value name="STRING2">
                <shadow type="text">
                <field name="TEXT">a</field>
                </shadow>
            </value>
        </block>
    `,
    mod: `
        <block type="operator_mod">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
    `,
    round: `
        <block type="operator_round">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
    `,
    mathop: `
        <block type="operator_mathop">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM"/>
                </shadow>
            </value>
        </block>
    `,
});

const operatorsDefaultBlocks = [
    'add',
    'subtract',
    'multiply',
    'divide',
    '--',
    'random',
    '--',
    'gt',
    'lt',
    'equals',
    '--',
    'and',
    'or',
    'not',
    '--',
    'join',
    'letter_of',
    'length',
    'contains',
    '--',
    'mod',
    'round',
    '--',
    'mathop',
];

const operators = prepareBlocks(operatorsDefaultBlocks, operatorsBlockLib, (isStage, blockXml) => `
    <category name="Operatoren" id="operators" iconURI="/static/icons/icon_operatoren.svg">
        ${blockXml}
    </category>
`);

const variables = function() {
    return `
    <category name="Variablen" id="variables" iconURI="/static/icons/icon_variablen.svg" custom="VARIABLE">
    </category>
    `;
};

const categoryMap = {
    motion,
    looks,
    sound,
    events,
    control,
    sensing,
    operators,
    variables,
};

const xmlOpen = '<xml style="display: none">';
const xmlClose = '</xml>';

/**
 * @param {!boolean} isStage - Whether the toolbox is for a stage-type target.
 * @param {?string} targetId - The current editing target
 * @param {string?} categoriesXML - null for default toolbox, or an XML string with <category> elements.
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
const makeToolboxXML = function(isStage, targetId, categoriesXML, customBlocks = null) {
    const gap = [ categorySeparator ];

    const categories = !Array.isArray(customBlocks)
        ? Object.values(categoryMap)
            .map((cat) => cat(isStage, targetId) + categorySeparator)
        : customBlocks
            .map((item) => categoryMap[item.category](isStage, targetId, item.blocks));

    const everything = [ xmlOpen ]
        .concat(categories);

    if (categoriesXML) {
        everything.push(gap, categoriesXML);
    }

    everything.push(xmlClose);
    return everything.join('\n');
};

export default makeToolboxXML;
