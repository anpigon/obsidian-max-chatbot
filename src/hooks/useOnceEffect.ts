import {EffectCallback, useEffect} from 'react';

function useOnceEffect(effect: EffectCallback) {
	useEffect(effect, []);
}

export default useOnceEffect;
