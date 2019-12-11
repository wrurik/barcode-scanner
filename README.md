# Barcode scan handler

This package can be used to retrieve input from a physical barcode-scanner that works just like a keyboard. 
It uses timing between character inputs to detect if the input is from a barcode-scanner.

## Install
```
npm install @wrurik/barcode-scanner
```

## Usage
First require the barcode scanner
```
let barcodeReader = require('@wrurik/barcode-scanner')
```

or 

```
import barcodeReader from `@wrurik/barcode-scanner`
```

You can start listening for input by invoking the `onScan` function:

```
let removeListener = barcodeReader.onScan(scanHandler, options)
```

The `onScan` function returns a function you can execute to stop listening for barcode-input.
So to stop the scan from the example above you should:
```
removeListener(); 
```

### Parameters
The `onScan` function expects 2 parameters:

#### Callback
The first parameter should be a function that is executed when the scan is completed.
This function receives the scanned input as only parameter.

#### Options
The second parameter is an object with options. The possible options are:

| Option           | Type     | Default      | Description 
| :--------------- | :------- | :----------  | :----------- 
| barcodePrefix    | String   | ''           | Prefix for the barcode. ScanHandler is only executed when the prefix is found in the scanned barcode.
| endCharacterCode | Number   | 13           | The characterCode that indicates the end of the scan. This can be configured in most barcode-readers. The default is the enter key (13)
| scanDuration     | Number   | 200          | The maximum time between character inputs in milliseconds.
| event            | String   | 'keypress'   | The Javascript-event it should listen to. 
