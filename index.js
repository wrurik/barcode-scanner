export default {
    /**
     *
     * @param {String} barcodePrefix
     * @param {Number} endCharacterCode
     * @param {Number} scanDuration
     * @param {Function} scanHandler
     * @param {String} event
     * @returns {Function} removeListener
     */
    onScan(scanHandler, {barcodePrefix, endCharacterCode, scanDuration, event} = {}) {
        if (barcodePrefix && typeof barcodePrefix !== 'string') {
            throw new TypeError('barcodePrefix must be a string');
        }

        if (endCharacterCode && typeof endCharacterCode !== 'number') {
            throw new TypeError('endCharacterCode must be a number');
        }

        if (scanDuration && typeof scanDuration !== 'number') {
            throw new TypeError('scanDuration must be a number');
        }

        if (event && typeof event !== 'string') {
            throw new TypeError('event must be a string');
        }

        barcodePrefix = barcodePrefix || '';
        endCharacterCode = endCharacterCode || 13;
        scanDuration = scanDuration || 200;
        event = event || 'keypress';

        let finishScanTimeoutId = null;
        let prefixBuffer = '';
        let valueBuffer = '';
        let matchedPrefix = false;

        const finishScan = function () {
            if (matchedPrefix) {
                scanHandler(valueBuffer);
            }

            resetScanState();
        };

        const resetScanState = function () {
            clearTimeout(finishScanTimeoutId);
            finishScanTimeoutId = null;
            prefixBuffer = '';
            valueBuffer = '';
            matchedPrefix = false;
        };

        const keyPressHandler = function (e) {
            const char = String.fromCharCode(e.which);
            const charIndex = barcodePrefix.indexOf(char);
            const expectedPrefixSlice = barcodePrefix.slice(0, charIndex);

            if (!finishScanTimeoutId) {
                finishScanTimeoutId = setTimeout(resetScanState, scanDuration);
            }

            if (e.which === endCharacterCode) {
                clearTimeout(finishScanTimeoutId);
                finishScan();
            } else if (prefixBuffer === expectedPrefixSlice && char === barcodePrefix.charAt(charIndex)) {
                prefixBuffer += char;
            } else if (matchedPrefix || barcodePrefix === '') {
                valueBuffer += char;
            }

            if (prefixBuffer === barcodePrefix) {
                matchedPrefix = true;
            }
        };

        const removeListener = function () {
            document.removeEventListener(event, keyPressHandler);
        };

        document.addEventListener(event, keyPressHandler);
        return removeListener;
    }
}

