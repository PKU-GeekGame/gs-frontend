import {useGameInfo} from '../ctx/GameInfo';
import {TemplateFile} from '../widget/Template';

export function Game() {
    let info = useGameInfo();

    if(!info.feature.game)
        return (
            <div className="slim-container">
                <TemplateFile name="game" />
            </div>
        );
    else
        return (
            <div>portal...</div>
        );
}