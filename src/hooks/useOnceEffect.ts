import {EffectCallback, useEffect, useRef} from 'react';

function useOnceEffect(effect: EffectCallback) {
	useEffect(effect, []);
}

export default useOnceEffect;
