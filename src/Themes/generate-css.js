import Settings from '../Settings/index';

export default function generateCSS(theme, mode) {
	var ref = theme === 'random' ? this.randomize() : Settings.user.themes.colors[theme],
		_ms = mode === 'cell' || theme === 'classic',
		cellFix = {
			row: k => `.${k} ` + (_ms ? '{background:' : 'a {color:') + ref[k] + '}',
			text: k => `.${k} {color:` + (_ms ? this.tune(ref.bodytable, ref[k]) : ref.bodytable) + '}',
			export: k => `.${k} button {color:` + (_ms ? this.tune(ref.export, ref[k]) : ref.export) + '}',
			vlink: k => `.${k} a:not(.static):visited {color:` + (_ms
				? this.tune(ref.vlink, ref[k])
				: ref.vlink) + '}'
		},
		css = `body {color:${ref.defaultText}; background-color:${ref.background}}
            /*#status {color:${ref.secondText}}*/
            #sortdirs {color:${ref.inputText}}
            #curtain {background:${ref.background}; opacity:0.5}
            .controlpanel i:after {color:${ref.accent}}
            #controlpanel {background:${ref.cpBackground}}
            #controlpanel input${theme === 'classic' ? '' : ', #controlpanel select'}
              {color:${ref.inputText}; border:1px solid; background:${theme === 'classic' ? '#fff' : ref.cpBackground}}
            #controlpanel label {color:${ref.defaultText}; background:${ref.cpBackground}}
            #controlpanel label:hover {background:${ref.hover}}
            #controlpanel label.checked {color:${ref.secondText}; background:${ref.highlight}}
            /*#resultsTable tbody a:not(.static):visited {color:${ref.vlink}}*/
            /*#resultsTable button {color:${ref.export}}*/
            thead, caption, a {color:${ref.defaultText}}
            tbody a {color:${ref.link}}
            .nohitDB {color:#000; background:${ref.nohitDB}}
            .hitDB {color:#000; background:${ref.hitDB}}
            .reqmaster {color:#000; background:${ref.reqmaster}}
            .nomaster {color:#000; background:${ref.nomaster}}
            .tooweak {background:${ref.unqualified}}
            ${cellFix.row('toNone')}    ${cellFix.text('toNone')}    ${cellFix.export('toNone')}    ${cellFix.vlink('toNone')}
            ${cellFix.row('toHigh')}    ${cellFix.text('toHigh')}    ${cellFix.export('toHigh')}    ${cellFix.vlink('toHigh')}
            ${cellFix.row('toGood')}    ${cellFix.text('toGood')}    ${cellFix.export('toGood')}    ${cellFix.vlink('toGood')}
            ${cellFix.row('toAverage')} ${cellFix.text('toAverage')} ${cellFix.export('toAverage')} ${cellFix.vlink('toAverage')}
            ${cellFix.row('toLow')}     ${cellFix.text('toLow')}     ${cellFix.export('toLow')}     ${cellFix.vlink('toLow')}
            ${cellFix.row('toPoor')}    ${cellFix.text('toPoor')}    ${cellFix.export('toPoor')}    ${cellFix.vlink('toPoor')}`;
	if (theme !== 'classic') css += `\n.controlpanel button {color:${ref.accent}; background:transparent;}`;
	return css;
}
