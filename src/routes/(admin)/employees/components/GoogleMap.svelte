<script lang="ts">
	// Google Maps APIの型定義
	interface GoogleMaps {
		Map: new (element: HTMLElement, options?: any) => any;
		Geocoder: new () => any;
		Marker: new (options?: any) => any;
		GeocoderStatus: {
			OK: string;
		};
	}

	interface Google {
		maps: GoogleMaps;
	}

	declare global {
		interface Window {
			google?: Google;
		}
	}

	type Props = {
		address?: string;
		apiKey?: string;
	};

	let { address, apiKey }: Props = $props();

	let mapContainer = $state<HTMLDivElement | null>(null);
	let mapInstance: any = null;
	let geocoder: any = null;
	let marker: any = null;

	// Google Maps APIを読み込む
	async function loadGoogleMapsAPI(): Promise<void> {
		if (window.google?.maps) {
			return;
		}

		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey || ''}&libraries=places&language=ja`;
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Google Maps APIの読み込みに失敗しました'));
			document.head.appendChild(script);
		});
	}

	// 地図を初期化
	async function initializeMap() {
		if (!mapContainer) return;

		try {
			await loadGoogleMapsAPI();

			if (!window.google?.maps) {
				console.error('Google Maps APIが読み込まれていません');
				return;
			}

			// 地図の初期位置（日本）
			const defaultCenter = { lat: 35.6812, lng: 139.7671 };

			// 地図を作成
			mapInstance = new window.google.maps.Map(mapContainer, {
				center: defaultCenter,
				zoom: 15,
				disableDefaultUI: false,
				zoomControl: true,
				mapTypeControl: true,
				scaleControl: true,
				streetViewControl: true,
				rotateControl: true,
				fullscreenControl: true
			});

			// Geocoderを初期化
			geocoder = new window.google.maps.Geocoder();

			// 住所が指定されている場合は地図を更新
			if (address) {
				updateMap(address);
			}
		} catch (error) {
			console.error('地図の初期化に失敗しました:', error);
		}
	}

	// 住所から地図を更新
	function updateMap(addressString: string) {
		if (!geocoder || !mapInstance || !addressString.trim()) return;

		geocoder.geocode({ address: addressString, region: 'jp' }, (results: any, status: string) => {
			if (status === 'OK' && results && results[0]) {
				const location = results[0].geometry.location;
				mapInstance?.setCenter(location);
				mapInstance?.setZoom(16);

				// 既存のマーカーを削除
				if (marker) {
					marker.setMap(null);
				}

				// 新しいマーカーを追加
				marker = new window.google.maps.Marker({
					map: mapInstance,
					position: location,
					title: addressString
				});
			} else {
				console.warn('住所の検索に失敗しました:', status);
			}
		});
	}

	// コンポーネントがマウントされたときに地図を初期化
	$effect(() => {
		if (mapContainer) {
			initializeMap();
		}
	});

	// 住所が変更されたときに地図を更新
	$effect(() => {
		if (address && mapInstance && geocoder) {
			updateMap(address);
		}
	});
</script>

<div class="google-map-container">
	{#if !apiKey}
		<div class="map-error">
			Google Maps APIキーが設定されていません。環境変数 GOOGLE_MAPS_API_KEY を設定してください。
		</div>
	{:else}
		<div bind:this={mapContainer} class="map"></div>
	{/if}
</div>

<style>
	.google-map-container {
		width: 100%;
		height: 400px;
		border: 1px solid var(--color-border, #ddd);
		border-radius: 4px;
		overflow: hidden;
	}

	.map {
		width: 100%;
		height: 100%;
	}

	.map-error {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 1rem;
		background: var(--color-bg-muted, #f5f5f5);
		color: var(--color-text-muted, #666);
		text-align: center;
	}
</style>

