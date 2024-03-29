/**
 *  const cameraService = new CameraService();
 *
 *     getVideoDevices().then(async (devices) => {
 *         cameraService.init({
 *             width: _width,
 *             height: _height,
 *             device: null,
 *         });
 *         await cameraService.setDevice(devices[0])
 *         await cameraService.start();
 *     })
 *
 *     */

export interface CameraServiceInitParams {
    width: number;
    height: number;
    device: MediaDeviceInfo | null;
}

export class CameraService {

    isOn: boolean;
    isPause: boolean;

    width: number;
    height: number;

    stream: MediaStream | null;

    videoElement: HTMLVideoElement;
    canvasElement: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D | null;
    device: MediaDeviceInfo | null;

    init(params: CameraServiceInitParams) {
        this.width = params.width;
        this.height = params.height;

        this.device = params.device;

        this.videoElement = document.createElement('video');
        this.videoElement.width = this.width;
        this.videoElement.height = this.height;

        this.canvasElement = document.createElement('canvas');
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        this.canvasContext = this.canvasElement.getContext('2d');
    }

    async start() {

        this.isOn = true;

        if (!this.device)
            return;

        this.stream = await this.getMediaStreamToVideoElement(this.device, this.videoElement);

    }

    stop() {
        this.isOn = false;
        this.isPause = false;

        this.stopMediaStreamVideo(this.stream, this.videoElement);
    }

    pause() {
        this.isPause = true;
    }
    resume() {
        this.isPause = false;

    }

    receiveImageDataData = (): Uint8ClampedArray | undefined => {
        if (this.isOn) {
            this.canvasContext?.drawImage(this.videoElement, 0, 0, this.width, this.height);
            return this.canvasContext?.getImageData(0, 0, this.width, this.height).data;
        } else {
            return undefined;
        }
    };

    receiveImageData = (): ImageData | undefined => {
        if (this.isOn) {
            this.canvasContext?.drawImage(this.videoElement, 0, 0, this.width, this.height);
            return this.canvasContext?.getImageData(0, 0, this.width, this.height);
        } else {
            return undefined;
        }
    };

    receiveImage = (): HTMLCanvasElement | undefined => {
        if (this.isOn) {
            this.canvasContext?.drawImage(this.videoElement, 0, 0, this.width, this.height);
            return this.canvasElement;
        } else {
            return undefined;
        }
    };

    async setDevice(device: MediaDeviceInfo) {
        this.device = device;
        if (this.isOn) {
            this.stop();

            await this.start();
        }
    }


    async getMediaStreamToVideoElement(device?: MediaDeviceInfo, element?: HTMLVideoElement | null): Promise<MediaStream | null> {
        if (device) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: device ? {
                    deviceId: device?.deviceId,
                    width: this.width,
                    height: this.height
                } : true
            });

            if (element) {
                element.srcObject = stream;
                element.play();
            }

            console.log(2, stream.getVideoTracks(), stream.getVideoTracks()[0]?.getCapabilities())
            return stream;
        } else {
            return null
        }
    }

    stopMediaStreamVideo(stream: MediaStream | null, element?: HTMLVideoElement | null) {
        if (element) {
            element.pause();
            element.srcObject = null;
        }
        stream?.getTracks().forEach(track => track.stop());

        return null;
    }
}
