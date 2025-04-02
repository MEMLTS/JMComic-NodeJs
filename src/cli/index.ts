#!/usr/bin/env node

import { program } from 'commander';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { detail } from '@/modules/detail';
import { fetchAndProcessPhoto } from '@/modules/photo';
import { Readable } from 'stream';
import { setupLogger } from '@/core/log';

const sanitizeFilename = (name: string) =>
    name.replace(/[<>:"/\\|?*]/g, '_').trim();

const downloadComic = async (comicId: number) => {
    let totalPages = 0;
    let completed = 0;

    const updateProgress = () => {
        const percent = ((completed / totalPages) * 100).toFixed(1);
        const progressBar = `[${'■'.repeat(Math.floor(completed/2))}${'□'.repeat(50 - Math.floor(completed/2))}]`;
        process.stdout.write(`\r${progressBar} ${percent}% (${completed}/${totalPages})`);
    };

    try {
        const comicData = await detail(comicId);
        if (!comicData || !comicData.title) {
            throw new Error(`无法获取漫画ID为 ${comicId} 的详情`);
        }

        totalPages = comicData.pages;
        const folderName = sanitizeFilename(comicData.title);
        await mkdir(folderName, { recursive: true });

        process.stdout.write('\n');
        updateProgress();

        const downloadPromises = Array.from(
            { length: totalPages },
            (_, i) => {
                const imageId = i + 1;
                const filePath = path.join(folderName, `${imageId}.jpg`);
                const writer = createWriteStream(filePath);

                return new Promise<void>((resolve, reject) => {
                    fetchAndProcessPhoto({ id: comicId, page: imageId })
                        .then(data => {
                            const stream = Readable.from([data]);
                            stream.pipe(writer)
                                .on('finish', () => {
                                    completed++;
                                    updateProgress();
                                    resolve();
                                })
                                .on('error', reject);
                        })
                        .catch(reject);
                });
            }
        );

        await Promise.all(downloadPromises);
        process.stdout.write('\n\n');
        logger.info(`✅ 下载完成，共 ${totalPages} 页`);

    } catch (error) {
        process.stdout.write('\n\n');
        logger.error('❌ 下载失败:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

program
    .requiredOption('-d, --download <number>', '漫画ID')
    .action((options) => {
        setupLogger();
        const comicId = parseInt(options.download, 10);
        if (isNaN(comicId)) {
            logger.error('❌ 无效的漫画ID');
            process.exit(1);
        }
        downloadComic(comicId);
    });

program.parse(process.argv);
