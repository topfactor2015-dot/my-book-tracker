import { useMemo, useState } from 'react';
import { GARDEN_STAGES, getGardenProgress } from './readingGarden.js';
import './readingGarden.css';

function PumpkinArt({ stage, name }) {
  const size = stage === 3 ? .68 : stage === 4 ? .86 : 1;
  return <svg className="garden-art" viewBox="0 0 320 230" role="img" aria-label={`${name}: ${GARDEN_STAGES[stage].title}`}>
    <defs>
      <radialGradient id="garden-lamp"><stop stopColor="#f9d99c" stopOpacity=".55"/><stop offset="1" stopColor="#f9d99c" stopOpacity="0"/></radialGradient>
      <linearGradient id="garden-skin" x2=".2" y2="1"><stop stopColor="#f0ad58"/><stop offset="1" stopColor="#b9572f"/></linearGradient>
    </defs>
    <circle cx="160" cy="118" r="105" fill="url(#garden-lamp)"/>
    <path d="M33 198H287" stroke="#ad8e6a" strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="160" cy="199" rx="103" ry="11" fill="#4f382b" opacity=".12"/>
    <g fill="#c4a577"><path d="M50 57l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M258 93l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><circle cx="239" cy="47" r="2"/><circle cx="75" cy="110" r="2"/></g>
    <g className="garden-growing">
      {stage === 0 && <><path d="M117 151H203L193 194H127Z" fill="#ad7859"/><path d="M111 147Q160 134 209 147V157H111Z" fill="#d09a71"/><ellipse cx="160" cy="146" rx="43" ry="7" fill="#5b4030"/><path d="M151 143Q152 128 169 132Q174 145 151 143" fill="#e9c18b"/></>}
      {(stage === 1 || stage === 2) && <><path d="M117 151H203L193 194H127Z" fill="#ad7859"/><path d="M111 147Q160 134 209 147V157H111Z" fill="#d09a71"/><ellipse cx="160" cy="146" rx="43" ry="7" fill="#5b4030"/><path d="M160 147Q153 112 163 87" fill="none" stroke="#527653" strokeWidth="6" strokeLinecap="round"/><path d="M159 121Q118 128 123 92Q153 91 159 121M161 109Q200 116 202 80Q174 76 161 109" fill="#7d9c68"/><path d="M128 97L154 116M196 85L167 104" fill="none" stroke="#a8bd89" strokeWidth="2"/>{stage === 2 && <g transform="translate(164 70)"><g fill="#efbc60"><ellipse cy="-13" rx="10" ry="18"/><ellipse cx="14" cy="-3" rx="18" ry="10" transform="rotate(30)"/><ellipse cx="-14" cy="-3" rx="18" ry="10" transform="rotate(-30)"/><ellipse cy="13" rx="13" ry="18"/></g><circle r="10" fill="#ac773c"/></g>}</>}
      {stage >= 3 && <g transform={`translate(160 190) scale(${size}) translate(-160 -190)`}>
        <path d="M160 92Q155 64 175 57" fill="none" stroke="#5b7047" strokeWidth="11" strokeLinecap="round"/>
        <path d="M167 79Q191 39 218 60Q209 91 167 79" fill="#819460"/>
        <path d="M158 87Q121 72 100 103Q71 120 85 157Q87 196 127 197Q159 211 189 196Q229 197 234 158Q249 120 218 101Q195 74 158 87" fill="url(#garden-skin)" stroke="#a95b32" strokeWidth="2"/>
        <path d="M133 91Q103 142 131 195M157 90Q143 143 158 202M183 90Q207 142 186 196M213 106Q230 147 211 185" fill="none" stroke="#a84e2d" strokeWidth="3" opacity=".45"/>
        <path d="M109 110Q97 122 98 135" fill="none" stroke="#ffd290" strokeWidth="5" strokeLinecap="round" opacity=".7"/>
        {stage >= 4 && <><ellipse cx="130" cy="140" rx="7" ry="10" fill={stage === 5 ? '#ffe1a1' : '#47372e'}/><ellipse cx="190" cy="140" rx="7" ry="10" fill={stage === 5 ? '#ffe1a1' : '#47372e'}/><path d="M148 163Q160 175 173 162" fill="none" stroke={stage === 5 ? '#ffe1a1' : '#6d3d2a'} strokeWidth="4" strokeLinecap="round"/><ellipse cx="116" cy="156" rx="10" ry="5" fill="#ed9b75" opacity=".65"/><ellipse cx="204" cy="156" rx="10" ry="5" fill="#ed9b75" opacity=".65"/></>}
        {stage === 5 && <><path d="M111 191Q136 183 160 193Q184 183 209 191V210Q184 202 160 212Q136 202 111 210Z" fill="#f8edd5" stroke="#806047" strokeWidth="2"/><path d="M160 193V211" stroke="#806047" strokeWidth="2"/></>}
      </g>}
    </g>
    <g transform="translate(37 174) rotate(-8)"><rect width="35" height="17" rx="3" fill="#7b8871"/><path d="M4 4H32M4 9H32" stroke="#d9dfca" strokeWidth="2"/></g>
    <g transform="translate(252 166) rotate(7)"><rect width="28" height="25" rx="3" fill="#a18175"/><path d="M7 2V23" stroke="#d7b69c" strokeWidth="2"/></g>
  </svg>;
}

export default function ReadingGarden({ garden, books, today, onPlant, onRename }) {
  const [expanded, setExpanded] = useState(false);
  const [draftName, setDraftName] = useState(garden?.name || 'Тыквик');
  const progress = useMemo(() => getGardenProgress(garden, books, today), [garden, books, today]);
  const stage = progress?.stageIndex || 0;
  const name = garden?.name || 'Тыквик';
  return <section className="reading-garden" aria-labelledby="garden-title">
    <div className="garden-main">
      <div className="garden-picture"><PumpkinArt stage={stage} name={name}/><span className="garden-revision">Сад историй · первая посадка</span></div>
      <div className="garden-content">
        <p className="garden-eyebrow">Маленькая история растёт рядом</p>
        <h2 id="garden-title">{garden ? name : 'Посадим книжную тыкву?'}</h2>
        <p className="garden-description">{garden ? progress.stage.message : 'Читай, записывай страницы и наблюдай, как из семечка появляется хранитель твоей библиотеки.'}</p>
        {garden ? <>
          <div className="garden-stage">{progress.stage.title}<span>{stage + 1} / {GARDEN_STAGES.length}</span></div>
          <div className="garden-counters"><span><strong>{progress.pages}</strong> страниц после посадки</span><span><strong>{progress.days}</strong> дней чтения</span></div>
          <progress aria-label="Рост книжной тыквы" max="100" value={progress.percent}/>
          <p className="garden-next" aria-live="polite">{progress.next ? `Дальше: ${progress.next.title.toLocaleLowerCase('ru-RU')}. Ещё ${Math.max(0, progress.next.pages - progress.pages)} стр. и ${Math.max(0, progress.next.days - progress.days)} дн. чтения.` : 'Все шесть глав открыты. Тыквик остаётся рядом, а твои страницы продолжают считаться.'}</p>
          <button type="button" className="garden-secondary" aria-expanded={expanded} aria-controls="garden-details" onClick={() => setExpanded(value => !value)}>{expanded ? 'Свернуть историю ↑' : 'История и стадии роста ↓'}</button>
        </> : <>
          <button type="button" className="garden-primary" onClick={onPlant}>Посадить семечко</button>
          <p className="garden-note">Первые 10 новых страниц разбудят росток. Старое чтение не расходуется. За пропуски тыква не вянет.</p>
        </>}
      </div>
    </div>
    {garden && expanded && <div id="garden-details" className="garden-details">
      <form className="garden-name" onSubmit={event => { event.preventDefault(); const nextName = draftName.trim(); if (nextName) onRename(nextName); }}>
        <label htmlFor="garden-name-input">Как зовут твою тыкву?</label>
        <div><input id="garden-name-input" value={draftName} maxLength={24} onChange={event => setDraftName(event.target.value)} required/><button type="submit" className="garden-secondary">Сохранить имя</button></div>
      </form>
      <p className="garden-note">Рост дают новые положительные записи страниц в дневнике с даты посадки. Каждый день учитывается один раз. Для следующей стадии нужны и страницы, и дни — подряд читать не обязательно. Если исправить или удалить запись, рост пересчитается. Сад сохраняется вместе с библиотекой в бэкапе.</p>
      <ol className="garden-chapters">{GARDEN_STAGES.map((item, index) => <li key={item.title} className={index <= stage ? 'is-open' : ''} aria-current={index === stage ? 'step' : undefined}>
        <div className="garden-chapter-top"><span className="garden-chapter-number">{index <= stage ? '✦' : index + 1}</span><div><h3>{item.title}</h3><p>{item.pages} стр. · {item.days} дн. чтения</p></div><span className="garden-chapter-state">{index <= stage ? 'Открыто' : 'Впереди'}</span></div>
        {index <= stage && <p className="garden-story">{item.story}</p>}
      </li>)}</ol>
    </div>}
  </section>;
}
