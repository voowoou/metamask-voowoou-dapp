// Асинхронная функция для подключения к MetaMask
interface ConnectFunction {
  connect: () => Promise<void>;
}
