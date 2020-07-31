const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Bucket {
  private readonly queue: Array<Function> = [];
  private isGlobal = false;
  private globalResetTimeout = 5000;
  private limit = 5;
  private remaining = 1;
  private resetTimeout = 5000;

  private enableGlobal(date: number, retryAfter: number) {
    this.isGlobal = true;
    const offset = date - Date.now();
    this.globalResetTimeout = retryAfter * 1000 -
      (Date.now() + offset);
  }

  private setLimit(limit: number) {
    this.limit = limit;
  }

  private setRemaining(remaining: number | null) {
    this.remaining = Math.max(remaining ?? 1, 1);
  }

  private setResetTimeout(date: number, resetTimeout: number) {
    const offset = date - Date.now();
    this.resetTimeout = resetTimeout * 1000 -
      (Date.now() + offset);
  }

  public applyHeadersToBucket(headers: Headers): void {
    if (headers.has("x-ratelimit-global")) {
      this.enableGlobal(
        Date.parse(headers.get("date")!),
        +headers.get("retry-after")!,
      );
    }

    if (headers.has("x-ratelimit-limit")) {
      this.setLimit(+headers.get("x-ratelimit-limit")!);
    }

    const remaining = headers.get("x-ratelimit-remaining");
    this.setRemaining(
      remaining == null ? null : +remaining,
    );

    if (headers.has("x-ratelimit-reset")) {
      this.setResetTimeout(
        Date.parse(headers.get("date")!),
        +headers.get("x-ratelimit-reset")!,
      );
    }
  }

  public addQueue(func: Function): Promise<unknown> {
    return new Promise((resolve) => {
      this.queue.push(() => resolve(func(this)));
      this.checkQueue();
    });
  }

  public async checkQueue(): Promise<void> {
    if (this.isGlobal) {
      await pause(this.globalResetTimeout);
      this.remaining = this.limit;
    }
    if (this.remaining === 0) {
      await pause(this.resetTimeout);
      this.remaining = this.limit;
    }
    if (this.queue.length > 0 && this.remaining !== 0) {
      const head = this.queue.splice(0, 1)[0];
      head();
    }
  }
}
